import { useState, useCallback } from 'react';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

const INBOX = 'abdellatifbencheikh43@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2Z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const OkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ErrIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
  </svg>
);

export default function Contact({ revealRef }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [honey, setHoney] = useState('');

  const validate = useCallback((field, value) => {
    if (field === 'name') return value.trim().length >= 2 || 'Please tell me your name.';
    if (field === 'email') return EMAIL_RE.test(value.trim()) || 'I need a valid email to reply to you.';
    if (field === 'message') return value.trim().length >= 10 || 'A few more words would help — at least 10 characters.';
    return true;
  }, []);

  const markField = useCallback(
    (field, value) => {
      const result = validate(field, value);
      const isBad = result !== true;
      setErrors((prev) => ({ ...prev, [field]: isBad ? result : '' }));
      return isBad;
    },
    [validate]
  );

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    markField(field, value);
  };

  const handleChange = (field, value) => {
    if (field === 'name') setName(value);
    else if (field === 'email') setEmail(value);
    else if (field === 'subject') setSubject(value);
    else if (field === 'message') setMessage(value);

    if (touched[field]) {
      markField(field, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honey) return;

    const nameBad = markField('name', name);
    const emailBad = markField('email', email);
    const msgBad = markField('message', message);

    if (nameBad || emailBad || msgBad) return;

    setSending(true);
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + INBOX, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Portfolio — message from ' + name.trim(),
          _template: 'table',
          _captcha: 'false',
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || 'Project inquiry',
          message: message.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== 'true')
        throw new Error(json.message || 'The mail service rejected the message.');
      setStatus({
        kind: 'ok',
        html:
          'Message sent — thanks, ' +
          esc(name.trim().split(' ')[0]) +
          '. It landed in my inbox; expect a reply soon.',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setErrors({});
      setTouched({});
    } catch (err) {
      const mailto =
        'mailto:' +
        INBOX +
        '?subject=' +
        encodeURIComponent('Portfolio — message from ' + name.trim()) +
        '&body=' +
        encodeURIComponent(message.trim() + '\n\n— ' + name.trim() + ' (' + email.trim() + ')');
      setStatus({
        kind: 'err',
        html:
          'Something went wrong delivering your message. ' +
          esc(err.message || '') +
          ' You can also <a href="' +
          mailto +
          '">email me directly</a> instead.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-top reveal" ref={(el) => revealRef('contact-top', el)}>
          <span className="section-idx" aria-hidden="true">05</span>
          <span className="section-rule" aria-hidden="true"></span>
        </div>
        <h2 className="contact-title reveal" id="contact-title" ref={(el) => revealRef('contact-title', el)}>
          Let's work together<em>.</em>
        </h2>
        <p className="contact-lead reveal" ref={(el) => revealRef('contact-lead', el)}>
          Have a project in mind, or an opening for a full-stack developer? Send a message
          — it lands straight in my inbox.
        </p>
        <div className="contact-grid stagger">
          <form className="contact-form reveal" id="contact-form" noValidate onSubmit={handleSubmit} ref={(el) => revealRef('contact-form', el)}>
            <div className="form-head">
              <span className="t-dot r" aria-hidden="true"></span>
              <span className="t-dot y" aria-hidden="true"></span>
              <span className="t-dot g" aria-hidden="true"></span>
              <span className="form-file">message.js</span>
              <span className="form-note">replies &lt; 24h</span>
            </div>
            <div className="form-body">
              <div className={`field${errors.name && touched.name ? ' invalid' : ''}`}>
                <label htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength="80"
                  required
                  value={name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                  aria-describedby={errors.name && touched.name ? 'cf-name-err' : undefined}
                />
                <p className="field-err" id="cf-name-err">{errors.name && touched.name ? errors.name : ''}</p>
              </div>
              <div className={`field${errors.email && touched.email ? ' invalid' : ''}`}>
                <label htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength="120"
                  required
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                  aria-describedby={errors.email && touched.email ? 'cf-email-err' : undefined}
                />
                <p className="field-err" id="cf-email-err">{errors.email && touched.email ? errors.email : ''}</p>
              </div>
              <div className="field full">
                <label htmlFor="cf-subject">Subject <span className="opt">(optional)</span></label>
                <input
                  id="cf-subject"
                  name="subject"
                  type="text"
                  maxLength="120"
                  autoComplete="off"
                  value={subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                />
              </div>
              <div className={`field full${errors.message && touched.message ? ' invalid' : ''}`}>
                <label htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows="5"
                  maxLength="2000"
                  required
                  value={message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={(e) => handleBlur('message', e.target.value)}
                  aria-invalid={errors.message && touched.message ? 'true' : 'false'}
                  aria-describedby={errors.message && touched.message ? 'cf-message-err' : undefined}
                ></textarea>
                <p className="field-err" id="cf-message-err">{errors.message && touched.message ? errors.message : ''}</p>
              </div>
              <div className={`form-status${status ? ' show ' + status.kind : ''}`} role="status">
                {status && (
                  <>
                    {status.kind === 'ok' ? <OkIcon /> : <ErrIcon />}
                    <div dangerouslySetInnerHTML={{ __html: status.html }} />
                  </>
                )}
              </div>
              <div className="form-actions">
                <button className="btn-send" type="submit" disabled={sending}>
                  <SendIcon />
                  <span>{sending ? 'Sending…' : 'Send message'}</span>
                </button>
                <span className="form-hint">POST /message → inbox</span>
              </div>
            </div>
            <input
              className="hp-field"
              type="text"
              name="_honey"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
            />
          </form>

          <aside className="contact-info stagger">
            <h3 className="mini-label reveal" ref={(el) => revealRef('contact-label', el)}>// direct channels</h3>
            <a className="contact-tile reveal" href="mailto:abdellatifbencheikh43@gmail.com" ref={(el) => revealRef('tile-email', el)}>
              <span className="tile-ico" aria-hidden="true"><MailIcon /></span>
              <span className="tile-text">
                <span className="tile-label">Email</span>
                <span className="tile-value">abdellatifbencheikh43@gmail.com</span>
              </span>
              <span className="tile-arrow" aria-hidden="true"><ArrowIcon /></span>
            </a>
            <a className="contact-tile reveal" href="tel:+212621872954" ref={(el) => revealRef('tile-phone', el)}>
              <span className="tile-ico" aria-hidden="true"><PhoneIcon /></span>
              <span className="tile-text">
                <span className="tile-label">Phone</span>
                <span className="tile-value">+212 621 872 954</span>
              </span>
              <span className="tile-arrow" aria-hidden="true"><ArrowIcon /></span>
            </a>
            <a className="contact-tile reveal" href="https://github.com/abdellatif-bencheikh" target="_blank" rel="noopener noreferrer" ref={(el) => revealRef('tile-gh', el)}>
              <span className="tile-ico" aria-hidden="true"><GitHubIcon /></span>
              <span className="tile-text">
                <span className="tile-label">GitHub</span>
                <a href='https://github.com/Abdlatifbnchihk' className="tile-value">github.com/abdellatif-bencheikh</a>
              </span>
              <span className="tile-arrow" aria-hidden="true"><ArrowIcon /></span>
            </a>
            <div className="contact-tile reveal" ref={(el) => revealRef('tile-loc', el)}>
              <span className="tile-ico" aria-hidden="true"><LocationIcon /></span>
              <span className="tile-text">
                <span className="tile-label">Location</span>
                <span className="tile-value">Agadir, Morocco</span>
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
