//Візьміть декоратор DeprecatedMethod і навчіть його працювати з об'єктом, який вміє приймати причину, через яку його не варто використовувати,
//і назву методу, яким його можна замінити, якщо це можливо.

//Створіть декоратори поля MinLength, MaxLength та Email.

//Використайте попередню версію декораторів і зробіть так, щоб їх можно було використовувати разом.

interface IUserData {
    email: string;
    isUnnecesseryMethod: Function
}

class UserData implements IUserData {

    _email: string



    // @SetMinLengthDecorator(10)
    //Unable to resolve signature of method decorator when called as an expression.
    //Argument of type 'ClassSetterDecoratorContext<UserData, string> & { name: "email"; private: false; static: false; }' is not assignable to parameter of type 'ClassSetterDecoratorContext<UserData, (this: UserData, arg: any) => void>'.
    //The types of 'access.set' are incompatible between these types.
    //Type '(object: UserData, value: string) => void' is not assignable to type '(object: UserData, value: (this: UserData, arg: any) => void) => void'.
    //Types of parameters 'value' and 'value' are incompatible.
    //Type '(this: UserData, arg: any) => void' is not assignable to type 'string'.
    // @SetMaxLengthDecorator(16)
    // @SetEmailDecorator
    @SetMinLengthDecoratorOld(13)
    @SetMaxLengthDecoratorOld(16)
    @SetEmailDecoratorOld
    set email (value: string) {
        this._email = value
    }


    @DepricatedMethodOld(true)
    // @DepricatedMethod(true)
    isUnnecesseryMethod (): void {
        console.log ('lol')
    }
}

function SetEmailDecorator <This, Return> (
    target: (this: This, arg: any) => Return,
    context: ClassSetterDecoratorContext<This, (this: This, arg: any) => Return>
) {
    if (context.kind !== "setter") return new Error("Only setter's accessors!")

    return function (this: This, arg: any): Return {
        const atSign = arg.split('').includes('@')
        const daught = arg.split('').includes('.')

        if (atSign && daught) {
            console.log(arg)
            const res = target.call(this, arg)
            return res
        } else throw new Error("Incorrect email!")
    }
}

function SetMaxLengthDecorator (max: number) {
    return <This, Return> (
        target: (this: This, arg: any) => Return,
        context: ClassSetterDecoratorContext<This, (this: This, arg: any) => Return>
    ) => {
        if (context.kind !== "setter") return new Error("Only setter's accessors!")

        return function (this: This, arg: string): Return {
            if (arg.length <= max) {
                console.log("Max Decorator")
                const res = target.call(this, arg)
                return res
            }
            throw new Error("Incorrect maximum length!")
        }
    }
}

function SetMinLengthDecorator (min: number) {
    return <This, Return> (
        target: (this: This, arg: any) => Return,
        context: ClassSetterDecoratorContext<This, (this: This, arg: any) => Return>
    ) => {
        if (context.kind !== "setter") return new Error("Only setter's accessors!")

        return function (this: This, arg: string): Return {
            if (arg.length >= min) {
                console.log("Min Decorator")
                const res = target.call(this, arg)
                return res
            }
            throw new Error("Incorrect minimum length!")
        }
    }
}


function DepricatedMethod (isAboutToChange: boolean){
    return function <This, Args extends any[], Return> (
        target: (this: This, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
    )   {
        if (isAboutToChange === false) return
        return function replacementMethod(this: This, ...args: Args): Return {
            console.log('deprecated method')
            const res = target.call(this, ...args)
            return res
        }
    }
}

//EXPERIMENTAL DECORATORS

function SetEmailDecoratorOld(
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
) {
    const set = descriptor.set
    descriptor.set = (...args: any) => {
        const atSign = args[0].split('').includes('@')
        const daught = args[0].split('').includes('.')

        if (atSign && daught) {
            console.log("SetEmailDecoratorOld")
            set?.apply(target, args)
        }
        else throw new Error("Incorrect email!")
    }
}

function SetMaxLengthDecoratorOld (max: number) {
    return (
        target: Object,
        propertyKey: string | symbol,
        desciptor: PropertyDescriptor
    ) =>    {
        const set = desciptor.set
        desciptor.set = (...args: any) => {

            if (args[0].length <= max) {
                console.log("SetMaxLengthDecoratorOld")
                set?.apply(target, args)
            }
            else throw new Error("Incorrect maximum length!")
        }
    }
}

function SetMinLengthDecoratorOld (min: number) {
    return (
        target: Object,
        propertyKey: string | symbol,
        desciptor: PropertyDescriptor
    ) =>    {
        const set = desciptor.set
        desciptor.set = (...args: any) => {

            if (args[0].length >= min) {
                console.log("SetMinLengthDecoratorOld")
                set?.apply(target, args)
            }
            else throw new Error("Incorrect minimum length!")
        }
    }
}

function DepricatedMethodOld (isAbleToChange: boolean) {
    return (
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
        if (isAbleToChange) {
            descriptor.value = () => {
                return "smth new"
            }
        }
    }
}


const userData = new UserData()
console.log(userData)
console.log(userData.email = "new@email.com")
console.log(userData.isUnnecesseryMethod())
console.log(userData)