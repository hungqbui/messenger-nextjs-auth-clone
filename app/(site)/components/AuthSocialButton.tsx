import { IconType } from 'react-icons';

// Declare interface for these buttons
interface AuthSocialButtonProps {
    icon: IconType;
    onClick?: () => void;
}

// Implementing AuthSocialButtonProps to AuthSocialButton
const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
    icon: Icon,
    onClick
}
) => {
    return ( 
        // Returns a styled button with the icon
        <button  onClick={onClick} type='button' className='
            inline-flex
            w-full
            justify-center
            rounded-md
            bg-white
            px-4
            py-2
            text-gray-500
            shadow-sm
            ring-1
            ring-inset
            ring-gray-500
            hover:bg-gray-50
            focus:outline-offset-0
        '>
            <Icon  />
        </button>
     );
}
 
export default AuthSocialButton;