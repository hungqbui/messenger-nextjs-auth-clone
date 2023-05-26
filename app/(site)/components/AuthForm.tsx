
// To make the form interactive
'use client';

// Import axios for https requests
import axios from 'axios';

import { toast } from 'react-hot-toast'

import { signIn } from 'next-auth/react'

// Import react's hooks and fields
import { useState, useCallback } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";

// Import social icons from react-icons
import { BsGithub, BsGoogle } from 'react-icons/bs';

// Import components
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from './AuthSocialButton';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {

    // Variants and states of the form
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    // Toggle function to switch between login and register
    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState : {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    // Function handles form submission dynamically depending on variant
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        
        if (variant === 'REGISTER') {

            // Axios post call
            axios.post('../../api/register', data)
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setIsLoading(false));
        }

        if (variant === 'LOGIN') {
            signIn('credentials', {
                ...data,
                redirect: false
            })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials')
                }

                if (callback?.ok && !callback?.error) {
                    toast.success('Logged in!')
                }
            })
            .finally(() => setIsLoading(false))
        }
    }

    // Function handles authentication via social accounts
    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, { redirect: false })
        .then((callback) => {
            if (callback?.error) toast.error('Invalid credentials')
            if (callback?.ok && !callback?.error) toast.error('Logged in!')
        })
        .finally(() => setIsLoading(false));
    }

    return ( 
        <div
            className="
                mt-8
                sm:mx-auto
                sm:w-full
                sm:max-w-md
            "
        >
            <div
                className="
                    bg-white
                    px-4
                    py-8
                    shadow
                    sm:rounded-lg
                    sm:px-10
                "
            >
                {/* Main form */}
                <form 
                    className="space-y-6"
                    // Use handleSubmit to pass argument to onSubmit
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Only show the 'Name' field when the user is registering */}
                    {variant === 'REGISTER' && (
                        <Input 
                            id = 'name'
                            label = 'Name'
                            register={register}
                            errors={errors}
                            disabled={isLoading}
                        />
                    )}

                    {/* Inputs for emails and passwords */}
                    <Input id='email' label='Email address' type="email" register={register} errors={errors} disabled={isLoading}/>
                    <Input id='password' label='Password' type="password" register={register} errors={errors} disabled={isLoading}/>
                
                    <div>

                        {/* Form submit button */}
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type='submit'
                        >
                            {/* Display text correspondingly */}
                            {variant === 'LOGIN' ? 'Sign In' : 'Register'}

                        </Button>
                    </div>
                </form>

                {/* Social accounts sign-in alternatives option */}
                <div className="mt-6">
                    <div className="relative">
                        <div
                            className="
                                absolute
                                inset-0
                                flex
                                items-center
                            "
                        >
                            <div className="w-full border-t border-gray-300"/>
                        </div>
                        <div
                            className="relative flex justify-center text-sm"
                        >
                            <span className="bg-white px-2 text-gray-500" >
                                Or continue with
                            </span>

                        </div>
                    </div>
                    {/* Display Google and GitHub log-in options as AuthSocialButtons */}
                    <div className="mt-6 flex gap-2">

                        {/* Create buttons with corresponding icons and onClick actions */}
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                            />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                            />
                    </div>
                </div>

                {/* Variant changing button and display content correspondingly */}
                <div className="
                    flex
                    gap-2
                    justify-center
                    text-sm
                    mt-6
                    px-2
                    text-gray-500
                ">
                    {variant === 'LOGIN' ? 'New to messenger?' : 'Alredy a member?'}
                    <div
                        onClick={toggleVariant}
                        className="underline cursor-pointer"
                        >
                        {variant === "LOGIN" ? 'Create an account' : 'Click here to log in'}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default AuthForm;