import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInquirySchema, buildEmailDraft, sendInquiry } from '../../../utils/inquiry';
import { services } from '../../../data/services';
import { industries } from '../../../data/industries';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import './InquiryForm.css';
export default function InquiryForm({ isQuote = false }) {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get('service');
  const industry = industries.find((item) => item.slug === searchParams.get('industry'));
  const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT?.trim() || '/api/enquiry';
  const schema = useMemo(() => createInquirySchema(isQuote), [isQuote]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      service: services.some((item) => item.slug === requested) ? requested : '',
      message: '',
      consent: false,
      propertyType: industry?.title || '',
      location: '',
      personnel: '',
    },
  });
  const [status, setStatus] = useState(null);
  const [draft, setDraft] = useState(null);
  async function submit(values) {
    setStatus(null);
    setDraft(null);
    try {
      await sendInquiry(endpoint, { ...values, formType: isQuote ? 'quote' : 'contact' });
      setStatus({
        type: 'success',
        message: 'Your enquiry has been received. Thank you for contacting ARRC.',
      });
      reset();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
      setDraft(buildEmailDraft(values, error.recipient));
    }
  }
  function field(name, label, options = {}) {
    const { type = 'text', placeholder, autoComplete, required = true } = options;
    return (
      <div className="form-field">
        <label htmlFor={name}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        <input
          id={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...register(name)}
          aria-required={required}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errors[name] && (
          <span className="field-error" role="alert" id={`${name}-error`}>
            {errors[name].message}
          </span>
        )}
      </div>
    );
  }
  return (
    <form className="inquiry-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="inquiry-form__heading">
        <h2>{isQuote ? 'Tell us what you have in mind.' : 'Start a conversation.'}</h2>
        <p>Share your requirements and our team can help you plan the next step.</p>
      </div>
      <div className="inquiry-form__grid">
        {field('fullName', 'Full name', { autoComplete: 'name', placeholder: 'Your full name' })}
        {field('companyName', 'Company name', {
          autoComplete: 'organization',
          placeholder: 'Your organization',
        })}
        {field('email', 'Email address', {
          type: 'email',
          autoComplete: 'email',
          placeholder: 'you@company.com',
        })}
        {field('phone', 'Phone number', { type: 'tel', autoComplete: 'tel', placeholder: '+91' })}
        <div className={`form-field ${!isQuote ? 'form-field--full' : ''}`}>
          <label htmlFor="service">
            Service required <span aria-hidden="true">*</span>
          </label>
          <select
            id="service"
            {...register('service')}
            aria-required="true"
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? 'service-error' : undefined}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
            <option value="integrated-services">Integrated services / not sure yet</option>
          </select>
          {errors.service && (
            <span role="alert" className="field-error" id="service-error">
              {errors.service.message}
            </span>
          )}
        </div>
        {isQuote && (
          <>
            <div className="form-field">
              <label htmlFor="propertyType">
                Property type <span aria-hidden="true">*</span>
              </label>
              <select
                id="propertyType"
                {...register('propertyType')}
                aria-required="true"
                aria-invalid={!!errors.propertyType}
                aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
              >
                <option value="">Select a property type</option>
                {industries.map((item) => (
                  <option key={item.slug} value={item.title}>
                    {item.title}
                  </option>
                ))}
                <option value="Other environment">Other environment</option>
              </select>
              {errors.propertyType && (
                <span role="alert" className="field-error" id="propertyType-error">
                  {errors.propertyType.message}
                </span>
              )}
            </div>
            {field('location', 'Site location', { placeholder: 'City and area' })}
            <div className="form-field">
              <label htmlFor="personnel">
                Number of personnel <span className="optional">(optional)</span>
              </label>
              <input
                id="personnel"
                type="number"
                min="1"
                max="10000"
                step="1"
                inputMode="numeric"
                placeholder="If known"
                {...register('personnel')}
                aria-invalid={!!errors.personnel}
                aria-describedby={errors.personnel ? 'personnel-error' : undefined}
              />
              {errors.personnel && (
                <span role="alert" className="field-error" id="personnel-error">
                  {errors.personnel.message}
                </span>
              )}
            </div>
          </>
        )}
        <div className="form-field form-field--full">
          <label htmlFor="message">
            {isQuote ? 'Your requirements' : 'How can we help?'} <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            rows="5"
            maxLength="3000"
            placeholder="Tell us about your premises, priorities and the support you need…"
            {...register('message')}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <span role="alert" className="field-error" id="message-error">
              {errors.message.message}
            </span>
          )}
        </div>
      </div>
      <div className="consent-field">
        <label>
          <input
            type="checkbox"
            {...register('consent')}
            aria-required="true"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            I agree to be contacted about this enquiry. I have read the{' '}
            <Link to="/privacy-policy">privacy policy</Link>.
          </span>
        </label>
        {errors.consent && (
          <span role="alert" className="field-error" id="consent-error">
            {errors.consent.message}
          </span>
        )}
      </div>
      <div className="inquiry-form__submit">
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={isSubmitting ? 'Clock3' : 'ArrowUpRight'}
        >
          {isSubmitting ? 'Sending enquiry…' : 'Send enquiry'}
        </Button>
        <span>
          <Icon name="LockKeyhole" size={13} />
          Your details are used for your enquiry.
        </span>
      </div>
      {status && (
        <div
          className={`form-notice form-notice--${status.type}`}
          role={status.type === 'error' ? 'alert' : 'status'}
        >
          <Icon name={status.type === 'success' ? 'CircleCheck' : 'Mail'} size={21} />
          <div>
            <p>{status.message}</p>
            {draft && (
              <>
                <p className="form-notice__delivery">
                  You can also send your enquiry using your email app.
                </p>
                <a className="text-link" href={draft.href}>
                  Open email draft
                  <Icon name="ArrowUpRight" size={16} />
                </a>
                <details>
                  <summary>Review enquiry text</summary>
                  <pre>{draft.body}</pre>
                </details>
              </>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
