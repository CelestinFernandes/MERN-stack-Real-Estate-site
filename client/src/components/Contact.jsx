import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [emailProvider, setEmailProvider] = useState(null); // For selected email provider
  const [isMessageTyped, setIsMessageTyped] = useState(false); // Check if the message is typed

  const onChange = (e) => {
    setMessage(e.target.value);
    setIsMessageTyped(e.target.value.trim().length > 0); // Enable email provider selection only after typing a message
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const emailLinks = {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${landlord?.email}&su=Regarding ${listing.name}&body=${message}`,
    yahoo: `https://compose.mail.yahoo.com/?to=${landlord?.email}&subj=Regarding ${listing.name}&body=${message}`,
    outlook: `https://outlook.live.com/owa/?path=/mail/action/compose&to=${landlord?.email}&subject=Regarding ${listing.name}&body=${message}`,
  };

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>

          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          {/* Email provider selection, only visible after typing the message */}
          {isMessageTyped && (
            <div className='flex gap-4 mt-2'>
              <button
                onClick={() => setEmailProvider('gmail')}
                className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-100 ${
                  emailProvider === 'gmail' ? 'border-blue-500' : ''
                }`}
              >
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png'
                  alt='Gmail'
                  className='w-8 h-7'
                />
                Gmail
              </button>
              <button
                onClick={() => setEmailProvider('yahoo')}
                className={`flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100 ${
                  emailProvider === 'yahoo' ? 'border-blue-500' : ''
                }`}
              >
                <img
                  src='https://s.yimg.com/rz/p/yahoo_frontpage_en-US_s_f_p_bestfit_frontpage_2x.png'
                  alt='Yahoo'
                  className='w-8 h-7'
                />
                Yahoo
              </button>
              <button
                onClick={() => setEmailProvider('outlook')}
                className={`flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100 ${
                  emailProvider === 'outlook' ? 'border-blue-500' : ''
                }`}
              >
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Microsoft_Outlook_new_logo.svg/150px-Microsoft_Outlook_new_logo.svg.png'
                  alt='Outlook'
                  className='w-8 h-7'
                />
                Outlook
              </button>
            </div>
          )}

          {/* Show "Send Message" button only if email provider is selected */}
          {emailProvider && (
            <a
              href={emailLinks[emailProvider]} // Dynamically use the selected email service link
              target='_blank'
              rel='noopener noreferrer'
              className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 mt-4'
            >
              Send Message via {emailProvider.charAt(0).toUpperCase() + emailProvider.slice(1)}
            </a>
          )}
        </div>
      )}
    </>
  );
}
