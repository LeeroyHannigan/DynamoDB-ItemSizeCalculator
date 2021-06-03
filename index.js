const utf8 = require('utf8');
const Decimal = require('decimal.js')
const { marshall } = require("@aws-sdk/util-dynamodb");


const NESTED_OVERHEAD = 1;
const MAP_LIST_OVERHEAD = 3;

function sizeInBytes(item) {
    // If Empty Return 0
    if (!item) return 0;

    var size = 0;

    Object.keys(item).forEach(key => {
        // Check key exists in item
        if (!item.hasOwnProperty(key)) return;
        // Calc attrib name size
        size += utf8.encode(key).length;
        // Calc attib value size
        size += attributeSizeBytes(item[key]);
    })

    return size;
}

function attributeSizeBytes(attr) {
    if (!attr) return 0;

    // String
    if (attr.hasOwnProperty('S')) {
        return utf8.encode(attr.S).length;
    }

    // Number
    if (attr.hasOwnProperty('N')) {
        return numberSizeBytes(attr.N);
    }

    // Binary
    if (attr.hasOwnProperty('B')) {
        return atob(attr.B).length;
    }

    // Boolean
    if (attr.hasOwnProperty('BOOL')) {
        return 1;
    }

    // Null
    if (attr.hasOwnProperty('NULL')) {
        return 1;
    }

    // StringSet
    if (attr.hasOwnProperty('SS')) {
        var size = 0;

        for (var i = 0; i < attr.SS.length; i++) {
            size += utf8.encode(attr.SS[i]).length;
        }

        return size;
    }

    //  NumberSet
    if (attr.hasOwnProperty('NS')) {
        var size = 0;

        for (var i = 0; i < attr.NS.length; i++) {
            size += numberSizeBytes(attr.NS[i]);
        }

        return size;
    }

    // BinarySet
    if (attr.hasOwnProperty('BS')) {
        var size = 0;

        for (var i = 0; i < attr.BS.length; i++) {
            size += atob(attr.BS[i]).length;
        }

        return size;
    }

    // Map
    if (attr.hasOwnProperty('M')) {
        var size = MAP_LIST_OVERHEAD;

        Object.keys(attr.M).forEach(key => {
            if (!attr.M.hasOwnProperty(key)) return;

            size += utf8.encode(key).length;
            size += attributeSizeBytes(attr.M[key]);
            size += NESTED_OVERHEAD;
        })

        return size;
    }

    // List
    if (attr.hasOwnProperty('L')) {
        var size = MAP_LIST_OVERHEAD;

        for (var i = 0; i < attr.L.length; i++) {
            size += attributeSizeBytes(attr.L[i]);
            size += NESTED_OVERHEAD;
        }

        return size;
    }
    throw "Unknown data type: " + JSON.stringify(attr) + "\nSee https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.DataTypes.html";
}

function numberSizeBytes(n) {

    // Convert incase of numbers such as 1E-130
    var decimal = new Decimal(n);

    if (decimal == 0) return 1;

    // Convert numbers to whole numbers
    var fixed = decimal.toFixed();

    var size = measure(fixed.replace('-', '')) + 1;

    if (fixed.startsWith('-')) size++;

    if (size > 21) size = 21;
    return size;
}

function measure(n) {
    if (n.indexOf('.') !== -1) {
        var parts = n.split('.');
        var p0 = parts[0];
        var p1 = parts[1];
        if (p0 === '0') {
            p0 = '';
            p1 = zeros(p1, true);
        }
        if (p0.length % 2 !== 0) p0 = 'Z' + p0;
        if (p1.length % 2 !== 0) p1 = p1 + 'Z';
        return measure(p0 + p1);
    }
    n = zeros(n, true, true);
    return Math.ceil(n.length / 2);
}

function zeros(n, left, right) {
    while (left && true) {
        var t = n.replace(/^(0{2})/, '');
        if (t.length == n.length) break;
        n = t;
    }
    while (right && true) {
        var t = n.replace(/(0{2})$/, '');
        if (t.length == n.length) break;
        n = t;
    }
    return n;
}

exports.CalculateSize = (item, json) => {

    // Convert JSON to DDB-JSON
    if(json){
        try {
            item = marshall(item);
        } catch (err) {
            throw "Unable to marshall item.", err;
        }
    }
    
    var size = sizeInBytes(item);
    var rcus = Math.ceil(size / 4096);
    var wcus = Math.ceil(size / 1024);
    const res = {
        rcu: rcus,
        wcu: wcus,
        size: size
    }
    return res;
}



exports.IsUnderLimit = (item, json) => {

    if(json){
        try{
            item = marshall(item)
        }catch(err){
            throw "Unable to marshall item.", err;
        }
    }

    const res = this.CalculateSize(item);
    return res.size < 400000
}
