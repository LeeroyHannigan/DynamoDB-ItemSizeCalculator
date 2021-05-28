import { __read, __spreadArray, __values } from "tslib";
/**
 * Convert a JavaScript value to its equivalent DynamoDB AttributeValue type
 *
 * @param {NativeAttributeValue} data - The data to convert to a DynamoDB AttributeValue
 * @param {marshallOptions} options - An optional configuration object for `convertToAttr`
 */
export var convertToAttr = function (data, options) {
    var _a, _b, _c, _d, _e, _f;
    if (data === undefined) {
        throw new Error("Pass options.removeUndefinedValues=true to remove undefined values from map/array/set.");
    }
    else if (data === null && typeof data === "object") {
        return convertToNullAttr();
    }
    else if (Array.isArray(data)) {
        return convertToListAttr(data, options);
    }
    else if (((_a = data === null || data === void 0 ? void 0 : data.constructor) === null || _a === void 0 ? void 0 : _a.name) === "Set") {
        return convertToSetAttr(data, options);
    }
    else if (((_b = data === null || data === void 0 ? void 0 : data.constructor) === null || _b === void 0 ? void 0 : _b.name) === "Map") {
        return convertToMapAttrFromIterable(data, options);
    }
    else if (((_c = data === null || data === void 0 ? void 0 : data.constructor) === null || _c === void 0 ? void 0 : _c.name) === "Object" ||
        // for object which is result of Object.create(null), which doesn't have constructor defined
        (!data.constructor && typeof data === "object")) {
        return convertToMapAttrFromEnumerableProps(data, options);
    }
    else if (isBinary(data)) {
        if (data.length === 0 && (options === null || options === void 0 ? void 0 : options.convertEmptyValues)) {
            return convertToNullAttr();
        }
        // Do not alter binary data passed https://github.com/aws/aws-sdk-js-v3/issues/1530
        // @ts-expect-error Type '{ B: NativeAttributeBinary; }' is not assignable to type 'AttributeValue'
        return convertToBinaryAttr(data);
    }
    else if (typeof data === "boolean" || ((_d = data === null || data === void 0 ? void 0 : data.constructor) === null || _d === void 0 ? void 0 : _d.name) === "Boolean") {
        return { BOOL: data.valueOf() };
    }
    else if (typeof data === "number" || ((_e = data === null || data === void 0 ? void 0 : data.constructor) === null || _e === void 0 ? void 0 : _e.name) === "Number") {
        return convertToNumberAttr(data);
    }
    else if (typeof data === "bigint") {
        return convertToBigIntAttr(data);
    }
    else if (typeof data === "string" || ((_f = data === null || data === void 0 ? void 0 : data.constructor) === null || _f === void 0 ? void 0 : _f.name) === "String") {
        if (data.length === 0 && (options === null || options === void 0 ? void 0 : options.convertEmptyValues)) {
            return convertToNullAttr();
        }
        return convertToStringAttr(data);
    }
    else if ((options === null || options === void 0 ? void 0 : options.convertClassInstanceToMap) && typeof data === "object") {
        return convertToMapAttrFromEnumerableProps(data, options);
    }
    throw new Error("Unsupported type passed: " + data + ". Pass options.convertClassInstanceToMap=true to marshall typeof object as map attribute.");
};
var convertToListAttr = function (data, options) { return ({
    L: data
        .filter(function (item) { return !(options === null || options === void 0 ? void 0 : options.removeUndefinedValues) || ((options === null || options === void 0 ? void 0 : options.removeUndefinedValues) && item !== undefined); })
        .map(function (item) { return convertToAttr(item, options); }),
}); };
var convertToSetAttr = function (set, options) {
    var setToOperate = (options === null || options === void 0 ? void 0 : options.removeUndefinedValues) ? new Set(__spreadArray([], __read(set)).filter(function (value) { return value !== undefined; })) : set;
    if (!(options === null || options === void 0 ? void 0 : options.removeUndefinedValues) && setToOperate.has(undefined)) {
        throw new Error("Pass options.removeUndefinedValues=true to remove undefined values from map/array/set.");
    }
    if (setToOperate.size === 0) {
        if (options === null || options === void 0 ? void 0 : options.convertEmptyValues) {
            return convertToNullAttr();
        }
        throw new Error("Pass a non-empty set, or options.convertEmptyValues=true.");
    }
    var item = setToOperate.values().next().value;
    if (typeof item === "number") {
        return {
            NS: Array.from(setToOperate)
                .map(convertToNumberAttr)
                .map(function (item) { return item.N; }),
        };
    }
    else if (typeof item === "bigint") {
        return {
            NS: Array.from(setToOperate)
                .map(convertToBigIntAttr)
                .map(function (item) { return item.N; }),
        };
    }
    else if (typeof item === "string") {
        return {
            SS: Array.from(setToOperate)
                .map(convertToStringAttr)
                .map(function (item) { return item.S; }),
        };
    }
    else if (isBinary(item)) {
        return {
            // Do not alter binary data passed https://github.com/aws/aws-sdk-js-v3/issues/1530
            // @ts-expect-error Type 'ArrayBuffer' is not assignable to type 'Uint8Array'
            BS: Array.from(setToOperate)
                .map(convertToBinaryAttr)
                .map(function (item) { return item.B; }),
        };
    }
    else {
        throw new Error("Only Number Set (NS), Binary Set (BS) or String Set (SS) are allowed.");
    }
};
var convertToMapAttrFromIterable = function (data, options) { return ({
    M: (function (data) {
        var e_1, _a;
        var map = {};
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var _b = __read(data_1_1.value, 2), key = _b[0], value = _b[1];
                if (typeof value !== "function" && (value !== undefined || !(options === null || options === void 0 ? void 0 : options.removeUndefinedValues))) {
                    map[key] = convertToAttr(value, options);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return map;
    })(data),
}); };
var convertToMapAttrFromEnumerableProps = function (data, options) { return ({
    M: (function (data) {
        var map = {};
        for (var key in data) {
            var value = data[key];
            if (typeof value !== "function" && (value !== undefined || !(options === null || options === void 0 ? void 0 : options.removeUndefinedValues))) {
                map[key] = convertToAttr(value, options);
            }
        }
        return map;
    })(data),
}); };
// For future-proofing: this functions are called from multiple places
var convertToNullAttr = function () { return ({ NULL: true }); };
var convertToBinaryAttr = function (data) { return ({ B: data }); };
var convertToStringAttr = function (data) { return ({ S: data.toString() }); };
var convertToBigIntAttr = function (data) { return ({ N: data.toString() }); };
var validateBigIntAndThrow = function (errorPrefix) {
    throw new Error(errorPrefix + " " + (typeof BigInt === "function" ? "Use BigInt." : "Pass string value instead.") + " ");
};
var convertToNumberAttr = function (num) {
    if ([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
        .map(function (val) { return val.toString(); })
        .includes(num.toString())) {
        throw new Error("Special numeric value " + num.toString() + " is not allowed");
    }
    else if (num > Number.MAX_SAFE_INTEGER) {
        validateBigIntAndThrow("Number " + num.toString() + " is greater than Number.MAX_SAFE_INTEGER.");
    }
    else if (num < Number.MIN_SAFE_INTEGER) {
        validateBigIntAndThrow("Number " + num.toString() + " is lesser than Number.MIN_SAFE_INTEGER.");
    }
    return { N: num.toString() };
};
var isBinary = function (data) {
    var binaryTypes = [
        "ArrayBuffer",
        "Blob",
        "Buffer",
        "DataView",
        "File",
        "Int8Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int16Array",
        "Uint16Array",
        "Int32Array",
        "Uint32Array",
        "Float32Array",
        "Float64Array",
        "BigInt64Array",
        "BigUint64Array",
    ];
    if (data === null || data === void 0 ? void 0 : data.constructor) {
        return binaryTypes.includes(data.constructor.name);
    }
    return false;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydFRvQXR0ci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0VG9BdHRyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFLQTs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxJQUFNLGFBQWEsR0FBRyxVQUFDLElBQTBCLEVBQUUsT0FBeUI7O0lBQ2pGLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLHdGQUF3RixDQUFDLENBQUM7S0FDM0c7U0FBTSxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQ3BELE9BQU8saUJBQWlCLEVBQUUsQ0FBQztLQUM1QjtTQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM5QixPQUFPLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN6QztTQUFNLElBQUksQ0FBQSxNQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxXQUFXLDBDQUFFLElBQUksTUFBSyxLQUFLLEVBQUU7UUFDNUMsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3BEO1NBQU0sSUFBSSxDQUFBLE1BQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFdBQVcsMENBQUUsSUFBSSxNQUFLLEtBQUssRUFBRTtRQUM1QyxPQUFPLDRCQUE0QixDQUFDLElBQXlDLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDekY7U0FBTSxJQUNMLENBQUEsTUFBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVywwQ0FBRSxJQUFJLE1BQUssUUFBUTtRQUNwQyw0RkFBNEY7UUFDNUYsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLEVBQy9DO1FBQ0EsT0FBTyxtQ0FB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QWE7UUFDYixZQUFZO1FBQ1osYUFBYTtRQUNiLGNBQWM7UUFDZCxjQUFjO1FBQ2QsZUFBZTtRQUNmLGdCQUFnQjtLQUNqQixDQUFDO0lBRUYsSUFBSSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVyxFQUFFO1FBQ3JCLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BEO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdHRyaWJ1dGVWYWx1ZSB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIjtcblxuaW1wb3J0IHsgbWFyc2hhbGxPcHRpb25zIH0gZnJvbSBcIi4vbWFyc2hhbGxcIjtcbmltcG9ydCB7IE5hdGl2ZUF0dHJpYnV0ZUJpbmFyeSwgTmF0aXZlQXR0cmlidXRlVmFsdWUsIE5hdGl2ZVNjYWxhckF0dHJpYnV0ZVZhbHVlIH0gZnJvbSBcIi4vbW9kZWxzXCI7XG5cbi8qKlxuICogQ29udmVydCBhIEphdmFTY3JpcHQgdmFsdWUgdG8gaXRzIGVxdWl2YWxlbnQgRHluYW1vREIgQXR0cmlidXRlVmFsdWUgdHlwZVxuICpcbiAqIEBwYXJhbSB7TmF0aXZlQXR0cmlidXRlVmFsdWV9IGRhdGEgLSBUaGUgZGF0YSB0byBjb252ZXJ0IHRvIGEgRHluYW1vREIgQXR0cmlidXRlVmFsdWVcbiAqIEBwYXJhbSB7bWFyc2hhbGxPcHRpb25zfSBvcHRpb25zIC0gQW4gb3B0aW9uYWwgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIGBjb252ZXJ0VG9BdHRyYFxuICovXG5leHBvcnQgY29uc3QgY29udmVydFRvQXR0ciA9IChkYXRhOiBOYXRpdmVBdHRyaWJ1dGVWYWx1ZSwgb3B0aW9ucz86IG1hcnNoYWxsT3B0aW9ucyk6IEF0dHJpYnV0ZVZhbHVlID0+IHtcbiAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUGFzcyBvcHRpb25zLnJlbW92ZVVuZGVmaW5lZFZhbHVlcz10cnVlIHRvIHJlbW92ZSB1bmRlZmluZWQgdmFsdWVzIGZyb20gbWFwL2FycmF5L3NldC5gKTtcbiAgfSBlbHNlIGlmIChkYXRhID09PSBudWxsICYmIHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiKSB7XG4gICAgcmV0dXJuIGNvbnZlcnRUb051bGxBdHRyKCk7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIHJldHVybiBjb252ZXJ0VG9MaXN0QXR0cihkYXRhLCBvcHRpb25zKTtcbiAgfSBlbHNlIGlmIChkYXRhPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJTZXRcIikge1xuICAgIHJldHVybiBjb252ZXJ0VG9TZXRBdHRyKGRhdGEgYXMgU2V0PGFueT4sIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKGRhdGE/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIk1hcFwiKSB7XG4gICAgcmV0dXJuIGNvbnZlcnRUb01hcEF0dHJGcm9tSXRlcmFibGUoZGF0YSBhcyBNYXA8c3RyaW5nLCBOYXRpdmVBdHRyaWJ1dGVWYWx1ZT4sIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKFxuICAgIGRhdGE/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIk9iamVjdFwiIHx8XG4gICAgLy8gZm9yIG9iamVjdCB3aGljaCBpcyByZXN1bHQgb2YgT2JqZWN0LmNyZWF0ZShudWxsKSwgd2hpY2ggZG9lc24ndCBoYXZlIGNvbnN0cnVjdG9yIGRlZmluZWRcbiAgICAoIWRhdGEuY29uc3RydWN0b3IgJiYgdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIpXG4gICkge1xuICAgIHJldHVybiBjb252ZXJ0VG9NYXBBdHRyRnJvbUVudW1lcmFibGVQcm9wcyhkYXRhIGFzIHsgW2tleTogc3RyaW5nXTogTmF0aXZlQXR0cmlidXRlVmFsdWUgfSwgb3B0aW9ucyk7XG4gIH0gZWxzZSBpZiAoaXNCaW5hcnkoZGF0YSkpIHtcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDAgJiYgb3B0aW9ucz8uY29udmVydEVtcHR5VmFsdWVzKSB7XG4gICAgICByZXR1cm4gY29udmVydFRvTnVsbEF0dHIoKTtcbiAgICB9XG4gICAgLy8gRG8gbm90IGFsdGVyIGJpbmFyeSBkYXRhIHBhc3NlZCBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMtdjMvaXNzdWVzLzE1MzBcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFR5cGUgJ3sgQjogTmF0aXZlQXR0cmlidXRlQmluYXJ5OyB9JyBpcyBub3QgYXNzaWduYWJsZSB0byB0eXBlICdBdHRyaWJ1dGVWYWx1ZSdcbiAgICByZXR1cm4gY29udmVydFRvQmluYXJ5QXR0cihkYXRhKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJib29sZWFuXCIgfHwgZGF0YT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQm9vbGVhblwiKSB7XG4gICAgcmV0dXJuIHsgQk9PTDogZGF0YS52YWx1ZU9mKCkgfTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJudW1iZXJcIiB8fCBkYXRhPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJOdW1iZXJcIikge1xuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXJBdHRyKGRhdGEpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSBcImJpZ2ludFwiKSB7XG4gICAgcmV0dXJuIGNvbnZlcnRUb0JpZ0ludEF0dHIoZGF0YSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgfHwgZGF0YT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiU3RyaW5nXCIpIHtcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDAgJiYgb3B0aW9ucz8uY29udmVydEVtcHR5VmFsdWVzKSB7XG4gICAgICByZXR1cm4gY29udmVydFRvTnVsbEF0dHIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnZlcnRUb1N0cmluZ0F0dHIoZGF0YSk7XG4gIH0gZWxzZSBpZiAob3B0aW9ucz8uY29udmVydENsYXNzSW5zdGFuY2VUb01hcCAmJiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIikge1xuICAgIHJldHVybiBjb252ZXJ0VG9NYXBBdHRyRnJvbUVudW1lcmFibGVQcm9wcyhkYXRhIGFzIHsgW2tleTogc3RyaW5nXTogTmF0aXZlQXR0cmlidXRlVmFsdWUgfSwgb3B0aW9ucyk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgIGBVbnN1cHBvcnRlZCB0eXBlIHBhc3NlZDogJHtkYXRhfS4gUGFzcyBvcHRpb25zLmNvbnZlcnRDbGFzc0luc3RhbmNlVG9NYXA9dHJ1ZSB0byBtYXJzaGFsbCB0eXBlb2Ygb2JqZWN0IGFzIG1hcCBhdHRyaWJ1dGUuYFxuICApO1xufTtcblxuY29uc3QgY29udmVydFRvTGlzdEF0dHIgPSAoZGF0YTogTmF0aXZlQXR0cmlidXRlVmFsdWVbXSwgb3B0aW9ucz86IG1hcnNoYWxsT3B0aW9ucyk6IHsgTDogQXR0cmlidXRlVmFsdWVbXSB9ID0+ICh7XG4gIEw6IGRhdGFcbiAgICAuZmlsdGVyKChpdGVtKSA9PiAhb3B0aW9ucz8ucmVtb3ZlVW5kZWZpbmVkVmFsdWVzIHx8IChvcHRpb25zPy5yZW1vdmVVbmRlZmluZWRWYWx1ZXMgJiYgaXRlbSAhPT0gdW5kZWZpbmVkKSlcbiAgICAubWFwKChpdGVtKSA9PiBjb252ZXJ0VG9BdHRyKGl0ZW0sIG9wdGlvbnMpKSxcbn0pO1xuXG5jb25zdCBjb252ZXJ0VG9TZXRBdHRyID0gKFxuICBzZXQ6IFNldDxhbnk+LFxuICBvcHRpb25zPzogbWFyc2hhbGxPcHRpb25zXG4pOiB7IE5TOiBzdHJpbmdbXSB9IHwgeyBCUzogVWludDhBcnJheVtdIH0gfCB7IFNTOiBzdHJpbmdbXSB9IHwgeyBOVUxMOiB0cnVlIH0gPT4ge1xuICBjb25zdCBzZXRUb09wZXJhdGUgPSBvcHRpb25zPy5yZW1vdmVVbmRlZmluZWRWYWx1ZXMgPyBuZXcgU2V0KFsuLi5zZXRdLmZpbHRlcigodmFsdWUpID0+IHZhbHVlICE9PSB1bmRlZmluZWQpKSA6IHNldDtcblxuICBpZiAoIW9wdGlvbnM/LnJlbW92ZVVuZGVmaW5lZFZhbHVlcyAmJiBzZXRUb09wZXJhdGUuaGFzKHVuZGVmaW5lZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFBhc3Mgb3B0aW9ucy5yZW1vdmVVbmRlZmluZWRWYWx1ZXM9dHJ1ZSB0byByZW1vdmUgdW5kZWZpbmVkIHZhbHVlcyBmcm9tIG1hcC9hcnJheS9zZXQuYCk7XG4gIH1cblxuICBpZiAoc2V0VG9PcGVyYXRlLnNpemUgPT09IDApIHtcbiAgICBpZiAob3B0aW9ucz8uY29udmVydEVtcHR5VmFsdWVzKSB7XG4gICAgICByZXR1cm4gY29udmVydFRvTnVsbEF0dHIoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBQYXNzIGEgbm9uLWVtcHR5IHNldCwgb3Igb3B0aW9ucy5jb252ZXJ0RW1wdHlWYWx1ZXM9dHJ1ZS5gKTtcbiAgfVxuXG4gIGNvbnN0IGl0ZW0gPSBzZXRUb09wZXJhdGUudmFsdWVzKCkubmV4dCgpLnZhbHVlO1xuICBpZiAodHlwZW9mIGl0ZW0gPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTlM6IEFycmF5LmZyb20oc2V0VG9PcGVyYXRlKVxuICAgICAgICAubWFwKGNvbnZlcnRUb051bWJlckF0dHIpXG4gICAgICAgIC5tYXAoKGl0ZW0pID0+IGl0ZW0uTiksXG4gICAgfTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJiaWdpbnRcIikge1xuICAgIHJldHVybiB7XG4gICAgICBOUzogQXJyYXkuZnJvbShzZXRUb09wZXJhdGUpXG4gICAgICAgIC5tYXAoY29udmVydFRvQmlnSW50QXR0cilcbiAgICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS5OKSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFNTOiBBcnJheS5mcm9tKHNldFRvT3BlcmF0ZSlcbiAgICAgICAgLm1hcChjb252ZXJ0VG9TdHJpbmdBdHRyKVxuICAgICAgICAubWFwKChpdGVtKSA9PiBpdGVtLlMpLFxuICAgIH07XG4gIH0gZWxzZSBpZiAoaXNCaW5hcnkoaXRlbSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gRG8gbm90IGFsdGVyIGJpbmFyeSBkYXRhIHBhc3NlZCBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMtdjMvaXNzdWVzLzE1MzBcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVHlwZSAnQXJyYXlCdWZmZXInIGlzIG5vdCBhc3NpZ25hYmxlIHRvIHR5cGUgJ1VpbnQ4QXJyYXknXG4gICAgICBCUzogQXJyYXkuZnJvbShzZXRUb09wZXJhdGUpXG4gICAgICAgIC5tYXAoY29udmVydFRvQmluYXJ5QXR0cilcbiAgICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS5CKSxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgT25seSBOdW1iZXIgU2V0IChOUyksIEJpbmFyeSBTZXQgKEJTKSBvciBTdHJpbmcgU2V0IChTUykgYXJlIGFsbG93ZWQuYCk7XG4gIH1cbn07XG5cbmNvbnN0IGNvbnZlcnRUb01hcEF0dHJGcm9tSXRlcmFibGUgPSAoXG4gIGRhdGE6IE1hcDxzdHJpbmcsIE5hdGl2ZUF0dHJpYnV0ZVZhbHVlPixcbiAgb3B0aW9ucz86IG1hcnNoYWxsT3B0aW9uc1xuKTogeyBNOiB7IFtrZXk6IHN0cmluZ106IEF0dHJpYnV0ZVZhbHVlIH0gfSA9PiAoe1xuICBNOiAoKGRhdGEpID0+IHtcbiAgICBjb25zdCBtYXA6IHsgW2tleTogc3RyaW5nXTogQXR0cmlidXRlVmFsdWUgfSA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGRhdGEpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIiAmJiAodmFsdWUgIT09IHVuZGVmaW5lZCB8fCAhb3B0aW9ucz8ucmVtb3ZlVW5kZWZpbmVkVmFsdWVzKSkge1xuICAgICAgICBtYXBba2V5XSA9IGNvbnZlcnRUb0F0dHIodmFsdWUsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwO1xuICB9KShkYXRhKSxcbn0pO1xuXG5jb25zdCBjb252ZXJ0VG9NYXBBdHRyRnJvbUVudW1lcmFibGVQcm9wcyA9IChcbiAgZGF0YTogeyBba2V5OiBzdHJpbmddOiBOYXRpdmVBdHRyaWJ1dGVWYWx1ZSB9LFxuICBvcHRpb25zPzogbWFyc2hhbGxPcHRpb25zXG4pOiB7IE06IHsgW2tleTogc3RyaW5nXTogQXR0cmlidXRlVmFsdWUgfSB9ID0+ICh7XG4gIE06ICgoZGF0YSkgPT4ge1xuICAgIGNvbnN0IG1hcDogeyBba2V5OiBzdHJpbmddOiBBdHRyaWJ1dGVWYWx1ZSB9ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBkYXRhW2tleV07XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIgJiYgKHZhbHVlICE9PSB1bmRlZmluZWQgfHwgIW9wdGlvbnM/LnJlbW92ZVVuZGVmaW5lZFZhbHVlcykpIHtcbiAgICAgICAgbWFwW2tleV0gPSBjb252ZXJ0VG9BdHRyKHZhbHVlLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcDtcbiAgfSkoZGF0YSksXG59KTtcblxuLy8gRm9yIGZ1dHVyZS1wcm9vZmluZzogdGhpcyBmdW5jdGlvbnMgYXJlIGNhbGxlZCBmcm9tIG11bHRpcGxlIHBsYWNlc1xuY29uc3QgY29udmVydFRvTnVsbEF0dHIgPSAoKTogeyBOVUxMOiB0cnVlIH0gPT4gKHsgTlVMTDogdHJ1ZSB9KTtcbmNvbnN0IGNvbnZlcnRUb0JpbmFyeUF0dHIgPSAoZGF0YTogTmF0aXZlQXR0cmlidXRlQmluYXJ5KTogeyBCOiBOYXRpdmVBdHRyaWJ1dGVCaW5hcnkgfSA9PiAoeyBCOiBkYXRhIH0pO1xuY29uc3QgY29udmVydFRvU3RyaW5nQXR0ciA9IChkYXRhOiBzdHJpbmcgfCBTdHJpbmcpOiB7IFM6IHN0cmluZyB9ID0+ICh7IFM6IGRhdGEudG9TdHJpbmcoKSB9KTtcbmNvbnN0IGNvbnZlcnRUb0JpZ0ludEF0dHIgPSAoZGF0YTogYmlnaW50KTogeyBOOiBzdHJpbmcgfSA9PiAoeyBOOiBkYXRhLnRvU3RyaW5nKCkgfSk7XG5cbmNvbnN0IHZhbGlkYXRlQmlnSW50QW5kVGhyb3cgPSAoZXJyb3JQcmVmaXg6IHN0cmluZykgPT4ge1xuICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JQcmVmaXh9ICR7dHlwZW9mIEJpZ0ludCA9PT0gXCJmdW5jdGlvblwiID8gXCJVc2UgQmlnSW50LlwiIDogXCJQYXNzIHN0cmluZyB2YWx1ZSBpbnN0ZWFkLlwifSBgKTtcbn07XG5cbmNvbnN0IGNvbnZlcnRUb051bWJlckF0dHIgPSAobnVtOiBudW1iZXIgfCBOdW1iZXIpOiB7IE46IHN0cmluZyB9ID0+IHtcbiAgaWYgKFxuICAgIFtOdW1iZXIuTmFOLCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIE51bWJlci5ORUdBVElWRV9JTkZJTklUWV1cbiAgICAgIC5tYXAoKHZhbCkgPT4gdmFsLnRvU3RyaW5nKCkpXG4gICAgICAuaW5jbHVkZXMobnVtLnRvU3RyaW5nKCkpXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihgU3BlY2lhbCBudW1lcmljIHZhbHVlICR7bnVtLnRvU3RyaW5nKCl9IGlzIG5vdCBhbGxvd2VkYCk7XG4gIH0gZWxzZSBpZiAobnVtID4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICB2YWxpZGF0ZUJpZ0ludEFuZFRocm93KGBOdW1iZXIgJHtudW0udG9TdHJpbmcoKX0gaXMgZ3JlYXRlciB0aGFuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLmApO1xuICB9IGVsc2UgaWYgKG51bSA8IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSKSB7XG4gICAgdmFsaWRhdGVCaWdJbnRBbmRUaHJvdyhgTnVtYmVyICR7bnVtLnRvU3RyaW5nKCl9IGlzIGxlc3NlciB0aGFuIE51bWJlci5NSU5fU0FGRV9JTlRFR0VSLmApO1xuICB9XG4gIHJldHVybiB7IE46IG51bS50b1N0cmluZygpIH07XG59O1xuXG5jb25zdCBpc0JpbmFyeSA9IChkYXRhOiBhbnkpOiBib29sZWFuID0+IHtcbiAgY29uc3QgYmluYXJ5VHlwZXMgPSBbXG4gICAgXCJBcnJheUJ1ZmZlclwiLFxuICAgIFwiQmxvYlwiLFxuICAgIFwiQnVmZmVyXCIsXG4gICAgXCJEYXRhVmlld1wiLFxuICAgIFwiRmlsZVwiLFxuICAgIFwiSW50OEFycmF5XCIsXG4gICAgXCJVaW50OEFycmF5XCIsXG4gICAgXCJVaW50OENsYW1wZWRBcnJheVwiLFxuICAgIFwiSW50MTZBcnJheVwiLFxuICAgIFwiVWludDE2QXJyYXlcIixcbiAgICBcIkludDMyQXJyYXlcIixcbiAgICBcIlVpbnQzMkFycmF5XCIsXG4gICAgXCJGbG9hdDMyQXJyYXlcIixcbiAgICBcIkZsb2F0NjRBcnJheVwiLFxuICAgIFwiQmlnSW50NjRBcnJheVwiLFxuICAgIFwiQmlnVWludDY0QXJyYXlcIixcbiAgXTtcblxuICBpZiAoZGF0YT8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gYmluYXJ5VHlwZXMuaW5jbHVkZXMoZGF0YS5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuIl19