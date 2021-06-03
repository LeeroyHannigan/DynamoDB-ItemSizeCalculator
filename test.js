const CALC = require('./index')

const item = {
    "Id": {
        "N": "101"
    },
    "Title": {
        "S": "Book 101 Title"
    },
    "ISBN": {
        "S": "111-1111111111"
    },
    "Authors": {
        "L": [
            {
                "S": "Author1"
            }
        ]
    },
    "Price": {
        "N": "2"
    },
    "Dimensions": {
        "S": "8.5 x 11.0 x 0.5"
    },
    "PageCount": {
        "N": "500"
    },
    "InPublication": {
        "BOOL": true
    },
    "ProductCategory": {
        "S": "Book"
    }
}
let one = {
    "lee": "one"
}
try {
    let ddb = CALC.CalculateSize(item)
    let size = CALC.CalculateSize(one, true);
    console.log(ddb,size);
} catch (err) {
    console.log(err);
}
