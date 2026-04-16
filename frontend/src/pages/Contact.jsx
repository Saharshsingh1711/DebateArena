
import { Link } from 'react-router-dom';

function Contact() {
  return (
    <div className='animate-fadeUp max-w-[640px] mx-auto px-8 py-20'>

      <div className='text-[0.7rem] font-medium tracking-[2px] uppercase text-acc mb-2'>
        Contact
      </div>

      <h2 className='font-display text-[clamp(2.5rem,6vw,4rem)] tracking-[2px] leading-[1] mb-2 text-t1'>
        LET'S TALK
      </h2>

      <p className='text-t2 text-[0.92rem] leading-[1.8] mb-8'>
        For questions about AI Debate Arena, partnerships, or press, reach out and we'll get back to you as soon as possible.
      </p>

      <div className='bg-s2 border border-white/[0.07] rounded-[14px] p-8 space-y-6'>
        <div>
          <h3 className='text-[0.9rem] font-medium mb-2 text-t1'>General Inquiries</h3>
          <p className='text-[0.85rem] text-t2 leading-[1.8]'>
            Email us at <a className='text-acc' href='mailto:hello@aidebatearena.com'>hello@aidebatearena.com</a> for support, collaboration, or media requests.
          </p>
        </div>

        <div>
          <h3 className='text-[0.9rem] font-medium mb-2 text-t1'>Follow Us</h3>
          <p className='text-[0.85rem] text-t2 leading-[1.8]'>
            Stay updated with launch news and product updates on <span className='text-acc'>@AIDebateArena</span>.
          </p>
        </div>

        <div>
          <h3 className='text-[0.9rem] font-medium mb-2 text-t1'>Waitlist</h3>
          <p className='text-[0.85rem] text-t2 leading-[1.8]'>
            Want to join the beta? Reserve your spot on the waitlist on the <Link className='text-acc underline' to='/join-beta'>Join Beta</Link> page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
