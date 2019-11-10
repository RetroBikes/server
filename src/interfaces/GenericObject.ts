/**
 * Create simple objects key - value without that annoying typescript
 * warnings of 'property do not exists on type Object' or something like that.
 *
 * This interface uses generics concept, so you can create an
 * object of only strings, by example, just doing something like this:
 * const myObject: GenericObject<string> = {myprop: 'myvalue'};
 * console.log(myObject.myprop); // This don't give that errors.
 *
 * See the link below to know more about generics:
 * https://www.typescriptlang.org/docs/handbook/generics.html
 */
export default interface GenericObject<T> {

    /**
     * This allow you create any property in your object. The only restriction is the value
     * type you chosen by creating your object on generics. See the comment above to know more.
     * @type T
     */
    [key: string]: T;

}
