import * as yup from 'yup';
import Lazy from 'yup/lib/Lazy';
import { Assign, ObjectShape } from 'yup/lib/object';
import { AnyObject, Maybe, Optionals } from 'yup/lib/types';
import { TypeOf, Asserts } from 'yup/lib/util/types';

yup.addMethod<yup.NumberSchema>(yup.number, 'customMoreThan', function (Args) {
    const { message, comparedValue } = Args;
    return this.test('compare-more-than', message, function (value, conext) {
        if (value && conext.parent[comparedValue]) return value > conext.parent[comparedValue];
        return true;
    });
});

yup.addMethod<yup.NumberSchema>(yup.number, 'customLessThan', function (Args) {
    const { message, comparedValue } = Args;
    return this.test('compare-less-than', message, function (value, conext) {
        if (value && conext.parent[comparedValue]) return value < conext.parent[comparedValue];
        return true;
    });
});

yup.addMethod<yup.ArraySchema<yup.ObjectSchema<Assign<ObjectShape, any>>>>(
    yup.array,
    'unique',
    function (arrayField: string, field: string, message: string) {
        return this.test('find-duplication', message, function (list) {
            if (list === undefined) return true;

            const mapper = (x: any) => x[field];
            const set = [...new Set(list.map(mapper))];
            const isUnique = list.length == set.length;

            if (isUnique) return true;

            const idx = list?.findIndex((l, i) => mapper(l) !== set[i]);
            return this.createError({
                path: `${arrayField}.[${idx}].${field}`,
                message,
            });
        });
    }
);

declare module 'yup' {
    interface CompareArgs {
        message: string;
        comparedValue: string;
    }
    interface NumberSchema<
        TType extends Maybe<number> = number | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType
    > extends yup.BaseSchema<TType, TContext, TOut> {
        customMoreThan(Args: CompareArgs): NumberSchema<TType, TContext>;
    }

    interface NumberSchema<
        TType extends Maybe<number> = number | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType
    > extends yup.BaseSchema<TType, TContext, TOut> {
        customLessThan(Args: CompareArgs): NumberSchema<TType, TContext>;
    }

    interface ArraySchema<
        T extends yup.AnySchema | Lazy<any, any>,
        C extends AnyObject = AnyObject,
        TIn extends Maybe<TypeOf<T>[]> = TypeOf<T>[] | undefined,
        TOut extends Maybe<Asserts<T>[]> = Asserts<T>[] | Optionals<TIn>
    > extends yup.BaseSchema<TIn, C, TOut> {
        unique(arrayField: string, field: string, message: string): ArraySchema<T, C, TIn>;
    }
}

export default yup;
