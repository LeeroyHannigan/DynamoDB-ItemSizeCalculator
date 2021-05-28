import { __assign, __read, __values } from "tslib";
/**
 * Convert a DynamoDB AttributeValue object to its equivalent JavaScript type.
 *
 * @param {AttributeValue} data - The DynamoDB record to convert to JavaScript type.
 * @param {unmarshallOptions} options - An optional configuration object for `convertToNative`.
 */
export var convertToNative = function (data, options) {
    var e_1, _a;
    try {
        for (var _b = __values(Object.entries(data)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
            if (value !== undefined) {
                switch (key) {
                    case "NULL":
                        return null;
                    case "BOOL":
                        return Boolean(value);
                    case "N":
                        return convertNumber(value, options);
                    case "B":
                        return convertBinary(value);
                    case "S":
                        return convertString(value);
                    case "L":
                        return convertList(value, options);
                    case "M":
                        return convertMap(value, options);
                    case "NS":
                        return new Set(value.map(function (item) { return convertNumber(item, options); }));
                    case "BS":
                        return new Set(value.map(convertBinary));
                    case "SS":
                        return new Set(value.map(convertString));
                    default:
                        throw new Error("Unsupported type passed: " + key);
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    throw new Error("No value defined: " + JSON.stringify(data));
};
var convertNumber = function (numString, options) {
    if (options === null || options === void 0 ? void 0 : options.wrapNumbers) {
        return { value: numString };
    }
    var num = Number(numString);
    var infinityValues = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
    if ((num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) && !infinityValues.includes(num)) {
        if (typeof BigInt === "function") {
            try {
                return BigInt(numString);
            }
            catch (error) {
                throw new Error(numString + " can't be converted to BigInt. Set options.wrapNumbers to get string value.");
            }
        }
        else {
            throw new Error(numString + " is outside SAFE_INTEGER bounds. Set options.wrapNumbers to get string value.");
        }
    }
    return num;
};
// For future-proofing: Functions from scalar value as well as set value
var convertString = function (stringValue) { return stringValue; };
var convertBinary = function (binaryValue) { return binaryValue; };
var convertList = function (list, options) {
    return list.map(function (item) { return convertToNative(item, options); });
};
var convertMap = function (map, options) {
    return Object.entries(map).reduce(function (acc, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        return (__assign(__assign({}, acc), (_b = {}, _b[key] = convertToNative(value, options), _b)));
    }, {});
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydFRvTmF0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnZlcnRUb05hdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0E7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsSUFBTSxlQUFlLEdBQUcsVUFBQyxJQUFvQixFQUFFLE9BQTJCOzs7UUFDL0UsS0FBMkIsSUFBQSxLQUFBLFNBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQSxnQkFBQSw0QkFBRTtZQUF0QyxJQUFBLEtBQUEsbUJBQVksRUFBWCxHQUFHLFFBQUEsRUFBRSxLQUFLLFFBQUE7WUFDcEIsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUN2QixRQUFRLEdBQUcsRUFBRTtvQkFDWCxLQUFLLE1BQU07d0JBQ1QsT0FBTyxJQUFJLENBQUM7b0JBQ2QsS0FBSyxNQUFNO3dCQUNULE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4QixLQUFLLEdBQUc7d0JBQ04sT0FBTyxhQUFhLENBQUMsS0FBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNqRCxLQUFLLEdBQUc7d0JBQ04sT0FBTyxhQUFhLENBQUMsS0FBbUIsQ0FBQyxDQUFDO29CQUM1QyxLQUFLLEdBQUc7d0JBQ04sT0FBTyxhQUFhLENBQUMsS0FBZSxDQUFDLENBQUM7b0JBQ3hDLEtBQUssR0FBRzt3QkFDTixPQUFPLFdBQVcsQ0FBQyxLQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN6RCxLQUFLLEdBQUc7d0JBQ04sT0FBTyxVQUFVLENBQUMsS0FBMEMsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDekUsS0FBSyxJQUFJO3dCQUNQLE9BQU8sSUFBSSxHQUFHLENBQUUsS0FBa0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUMsQ0FBQztvQkFDbEYsS0FBSyxJQUFJO3dCQUNQLE9BQU8sSUFBSSxHQUFHLENBQUUsS0FBc0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDN0QsS0FBSyxJQUFJO3dCQUNQLE9BQU8sSUFBSSxHQUFHLENBQUUsS0FBa0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDekQ7d0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBNEIsR0FBSyxDQUFDLENBQUM7aUJBQ3REO2FBQ0Y7U0FDRjs7Ozs7Ozs7O0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO0FBQy9ELENBQUMsQ0FBQztBQUVGLElBQU0sYUFBYSxHQUFHLFVBQUMsU0FBaUIsRUFBRSxPQUEyQjtJQUNuRSxJQUFJLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxXQUFXLEVBQUU7UUFDeEIsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztLQUM3QjtJQUVELElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QixJQUFNLGNBQWMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM1RSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3JHLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO1lBQ2hDLElBQUk7Z0JBQ0YsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDMUI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLElBQUksS0FBSyxDQUFJLFNBQVMsZ0ZBQTZFLENBQUMsQ0FBQzthQUM1RztTQUNGO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFJLFNBQVMsa0ZBQStFLENBQUMsQ0FBQztTQUM5RztLQUNGO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRix3RUFBd0U7QUFDeEUsSUFBTSxhQUFhLEdBQUcsVUFBQyxXQUFtQixJQUFhLE9BQUEsV0FBVyxFQUFYLENBQVcsQ0FBQztBQUNuRSxJQUFNLGFBQWEsR0FBRyxVQUFDLFdBQXVCLElBQWlCLE9BQUEsV0FBVyxFQUFYLENBQVcsQ0FBQztBQUUzRSxJQUFNLFdBQVcsR0FBRyxVQUFDLElBQXNCLEVBQUUsT0FBMkI7SUFDdEUsT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQztBQUFsRCxDQUFrRCxDQUFDO0FBRXJELElBQU0sVUFBVSxHQUFHLFVBQ2pCLEdBQXNDLEVBQ3RDLE9BQTJCO0lBRTNCLE9BQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQ3hCLFVBQUMsR0FBNEMsRUFBRSxFQUFzQzs7WUFBdEMsS0FBQSxhQUFzQyxFQUFyQyxHQUFHLFFBQUEsRUFBRSxLQUFLLFFBQUE7UUFBZ0MsT0FBQSx1QkFDckYsR0FBRyxnQkFDTCxHQUFHLElBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsT0FDdEM7SUFId0YsQ0FHeEYsRUFDRixFQUFFLENBQ0g7QUFORCxDQU1DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdHRyaWJ1dGVWYWx1ZSB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIjtcblxuaW1wb3J0IHsgTmF0aXZlQXR0cmlidXRlVmFsdWUsIE51bWJlclZhbHVlIH0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQgeyB1bm1hcnNoYWxsT3B0aW9ucyB9IGZyb20gXCIuL3VubWFyc2hhbGxcIjtcblxuLyoqXG4gKiBDb252ZXJ0IGEgRHluYW1vREIgQXR0cmlidXRlVmFsdWUgb2JqZWN0IHRvIGl0cyBlcXVpdmFsZW50IEphdmFTY3JpcHQgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge0F0dHJpYnV0ZVZhbHVlfSBkYXRhIC0gVGhlIER5bmFtb0RCIHJlY29yZCB0byBjb252ZXJ0IHRvIEphdmFTY3JpcHQgdHlwZS5cbiAqIEBwYXJhbSB7dW5tYXJzaGFsbE9wdGlvbnN9IG9wdGlvbnMgLSBBbiBvcHRpb25hbCBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgYGNvbnZlcnRUb05hdGl2ZWAuXG4gKi9cbmV4cG9ydCBjb25zdCBjb252ZXJ0VG9OYXRpdmUgPSAoZGF0YTogQXR0cmlidXRlVmFsdWUsIG9wdGlvbnM/OiB1bm1hcnNoYWxsT3B0aW9ucyk6IE5hdGl2ZUF0dHJpYnV0ZVZhbHVlID0+IHtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgY2FzZSBcIk5VTExcIjpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgY2FzZSBcIkJPT0xcIjpcbiAgICAgICAgICByZXR1cm4gQm9vbGVhbih2YWx1ZSk7XG4gICAgICAgIGNhc2UgXCJOXCI6XG4gICAgICAgICAgcmV0dXJuIGNvbnZlcnROdW1iZXIodmFsdWUgYXMgc3RyaW5nLCBvcHRpb25zKTtcbiAgICAgICAgY2FzZSBcIkJcIjpcbiAgICAgICAgICByZXR1cm4gY29udmVydEJpbmFyeSh2YWx1ZSBhcyBVaW50OEFycmF5KTtcbiAgICAgICAgY2FzZSBcIlNcIjpcbiAgICAgICAgICByZXR1cm4gY29udmVydFN0cmluZyh2YWx1ZSBhcyBzdHJpbmcpO1xuICAgICAgICBjYXNlIFwiTFwiOlxuICAgICAgICAgIHJldHVybiBjb252ZXJ0TGlzdCh2YWx1ZSBhcyBBdHRyaWJ1dGVWYWx1ZVtdLCBvcHRpb25zKTtcbiAgICAgICAgY2FzZSBcIk1cIjpcbiAgICAgICAgICByZXR1cm4gY29udmVydE1hcCh2YWx1ZSBhcyB7IFtrZXk6IHN0cmluZ106IEF0dHJpYnV0ZVZhbHVlIH0sIG9wdGlvbnMpO1xuICAgICAgICBjYXNlIFwiTlNcIjpcbiAgICAgICAgICByZXR1cm4gbmV3IFNldCgodmFsdWUgYXMgc3RyaW5nW10pLm1hcCgoaXRlbSkgPT4gY29udmVydE51bWJlcihpdGVtLCBvcHRpb25zKSkpO1xuICAgICAgICBjYXNlIFwiQlNcIjpcbiAgICAgICAgICByZXR1cm4gbmV3IFNldCgodmFsdWUgYXMgVWludDhBcnJheVtdKS5tYXAoY29udmVydEJpbmFyeSkpO1xuICAgICAgICBjYXNlIFwiU1NcIjpcbiAgICAgICAgICByZXR1cm4gbmV3IFNldCgodmFsdWUgYXMgc3RyaW5nW10pLm1hcChjb252ZXJ0U3RyaW5nKSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCB0eXBlIHBhc3NlZDogJHtrZXl9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgTm8gdmFsdWUgZGVmaW5lZDogJHtKU09OLnN0cmluZ2lmeShkYXRhKX1gKTtcbn07XG5cbmNvbnN0IGNvbnZlcnROdW1iZXIgPSAobnVtU3RyaW5nOiBzdHJpbmcsIG9wdGlvbnM/OiB1bm1hcnNoYWxsT3B0aW9ucyk6IG51bWJlciB8IGJpZ2ludCB8IE51bWJlclZhbHVlID0+IHtcbiAgaWYgKG9wdGlvbnM/LndyYXBOdW1iZXJzKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IG51bVN0cmluZyB9O1xuICB9XG5cbiAgY29uc3QgbnVtID0gTnVtYmVyKG51bVN0cmluZyk7XG4gIGNvbnN0IGluZmluaXR5VmFsdWVzID0gW051bWJlci5QT1NJVElWRV9JTkZJTklUWSwgTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZXTtcbiAgaWYgKChudW0gPiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiB8fCBudW0gPCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUikgJiYgIWluZmluaXR5VmFsdWVzLmluY2x1ZGVzKG51bSkpIHtcbiAgICBpZiAodHlwZW9mIEJpZ0ludCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gQmlnSW50KG51bVN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bnVtU3RyaW5nfSBjYW4ndCBiZSBjb252ZXJ0ZWQgdG8gQmlnSW50LiBTZXQgb3B0aW9ucy53cmFwTnVtYmVycyB0byBnZXQgc3RyaW5nIHZhbHVlLmApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bnVtU3RyaW5nfSBpcyBvdXRzaWRlIFNBRkVfSU5URUdFUiBib3VuZHMuIFNldCBvcHRpb25zLndyYXBOdW1iZXJzIHRvIGdldCBzdHJpbmcgdmFsdWUuYCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudW07XG59O1xuXG4vLyBGb3IgZnV0dXJlLXByb29maW5nOiBGdW5jdGlvbnMgZnJvbSBzY2FsYXIgdmFsdWUgYXMgd2VsbCBhcyBzZXQgdmFsdWVcbmNvbnN0IGNvbnZlcnRTdHJpbmcgPSAoc3RyaW5nVmFsdWU6IHN0cmluZyk6IHN0cmluZyA9PiBzdHJpbmdWYWx1ZTtcbmNvbnN0IGNvbnZlcnRCaW5hcnkgPSAoYmluYXJ5VmFsdWU6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IGJpbmFyeVZhbHVlO1xuXG5jb25zdCBjb252ZXJ0TGlzdCA9IChsaXN0OiBBdHRyaWJ1dGVWYWx1ZVtdLCBvcHRpb25zPzogdW5tYXJzaGFsbE9wdGlvbnMpOiBOYXRpdmVBdHRyaWJ1dGVWYWx1ZVtdID0+XG4gIGxpc3QubWFwKChpdGVtKSA9PiBjb252ZXJ0VG9OYXRpdmUoaXRlbSwgb3B0aW9ucykpO1xuXG5jb25zdCBjb252ZXJ0TWFwID0gKFxuICBtYXA6IHsgW2tleTogc3RyaW5nXTogQXR0cmlidXRlVmFsdWUgfSxcbiAgb3B0aW9ucz86IHVubWFyc2hhbGxPcHRpb25zXG4pOiB7IFtrZXk6IHN0cmluZ106IE5hdGl2ZUF0dHJpYnV0ZVZhbHVlIH0gPT5cbiAgT2JqZWN0LmVudHJpZXMobWFwKS5yZWR1Y2UoXG4gICAgKGFjYzogeyBba2V5OiBzdHJpbmddOiBOYXRpdmVBdHRyaWJ1dGVWYWx1ZSB9LCBba2V5LCB2YWx1ZV06IFtzdHJpbmcsIEF0dHJpYnV0ZVZhbHVlXSkgPT4gKHtcbiAgICAgIC4uLmFjYyxcbiAgICAgIFtrZXldOiBjb252ZXJ0VG9OYXRpdmUodmFsdWUsIG9wdGlvbnMpLFxuICAgIH0pLFxuICAgIHt9XG4gICk7XG4iXX0=