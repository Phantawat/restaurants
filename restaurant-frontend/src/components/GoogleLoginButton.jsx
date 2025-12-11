import { GoogleLogin } from '@react-oauth/google';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log('Google credential:', credentialResponse.credential);

      const response = await axios.post('/api/auth/google', {
        credential: credentialResponse.credential,
      });

      console.log('Google login successful:', response.data);
      navigate('/restaurant', { replace: true });
    } catch (err) {
      console.error('Google login error:', err);
      alert('Google login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    alert('Google Login Failed');
  };

  return (
    <div className="google-login-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        text="signin_with"
        shape="rectangular"
        size="large"
        width="100%"
      />
    </div>
  );
}

export default GoogleLoginButton;
