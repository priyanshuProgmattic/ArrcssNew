import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createApplicationSchema,
  buildApplicationDraft,
  sendApplication,
} from '../../../utils/application';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import './ApplicationForm.css';

export default function ApplicationForm({ category }) {
  const endpoint = import.meta.env.VITE_CAREERS_ENDPOINT?.trim() || '/api/careers';
  const schema = useMemo(() => createApplicationSchema(category.id), [category.id]);
  const {
    register,
    handleSubmit,
    resetField,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      designation: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      currentLocation: '',
      experience: '',
      lastSalary: '',
      lastPost: '',
      consent: false,
    },
  });
  const resume = watch('resume')?.[0];
  const [result, setResult] = useState(null);

  useEffect(() => {
    resetField('designation');
    setResult(null);
  }, [category.id, resetField]);

  async function submit(values) {
    setResult(null);
    if (!endpoint) {
      setResult({ type: 'draft', draft: buildApplicationDraft(values, category.id) });
      return;
    }
    try {
      await sendApplication(endpoint, values, category.id);
      setResult({
        type: 'success',
        message: 'Your application has been received. Thank you for your interest in ARRC.',
      });
      reset();
    } catch (error) {
      setResult({ type: 'error', message: error.message });
    }
  }

  function field(name, label, { type = 'text', placeholder, autoComplete, required = false } = {}) {
    return (
      <div className="application-field">
        <label htmlFor={`application-${name}`}>
          {label} {required ? <span aria-hidden="true">*</span> : <small>(optional)</small>}
        </label>
        <input
          id={`application-${name}`}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register(name)}
          aria-required={required}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `application-${name}-error` : undefined}
        />
        {errors[name] && (
          <span id={`application-${name}-error`} className="application-error" role="alert">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  }

  return (
    <form className="application-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="application-form__heading">
        <span className="application-form__badge">
          <Icon name={category.icon} size={16} />
          {category.title}
        </span>
        <h3>Tell us about yourself.</h3>
        <p>
          Fields marked <span>*</span> are required. Everything else helps us get to know your
          experience.
        </p>
      </div>
      <div className="application-form__grid">
        <div className="application-field application-field--full">
          <label htmlFor="application-designation">
            Applying for <span aria-hidden="true">*</span>
          </label>
          <select
            id="application-designation"
            {...register('designation')}
            aria-required="true"
            aria-invalid={!!errors.designation}
            aria-describedby={errors.designation ? 'application-designation-error' : undefined}
          >
            <option value="">Choose a role</option>
            {category.roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.designation && (
            <span className="application-error" role="alert" id="application-designation-error">
              {errors.designation.message}
            </span>
          )}
        </div>
        {field('fullName', 'Full name', {
          required: true,
          autoComplete: 'name',
          placeholder: 'Your full name',
        })}
        {field('email', 'Email address', {
          required: true,
          type: 'email',
          autoComplete: 'email',
          placeholder: 'you@example.com',
        })}
        {field('phone', 'Phone number', {
          required: true,
          type: 'tel',
          autoComplete: 'tel',
          placeholder: '+91',
        })}
        {field('currentLocation', 'Current location', {
          autoComplete: 'address-level2',
          placeholder: 'Your city or area',
        })}
        <div className="application-field application-field--full">
          <label htmlFor="application-address">
            Address <small>(optional)</small>
          </label>
          <input
            id="application-address"
            autoComplete="street-address"
            placeholder="Your current address"
            {...register('address')}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'application-address-error' : undefined}
          />
          {errors.address && (
            <span className="application-error" role="alert" id="application-address-error">
              {errors.address.message}
            </span>
          )}
        </div>
        {field('experience', 'Work experience', { placeholder: 'e.g. 2 years, or fresher' })}
        {field('lastSalary', 'Last salary', { placeholder: 'If you would like to share' })}
        <div className="application-field--full">
          {field('lastPost', 'Last position / employer', {
            placeholder: 'Your most recent role or organization',
          })}
        </div>
        <div className="application-field application-field--full">
          <label htmlFor="application-resume">
            Upload resume <span aria-hidden="true">*</span>
          </label>
          <div className={`application-upload ${errors.resume ? 'has-error' : ''}`}>
            <span className="application-upload__icon">
              <Icon name={resume ? 'FileCheck2' : 'Upload'} size={27} />
            </span>
            <div>
              <strong>{resume ? resume.name : 'Choose your resume'}</strong>
              <span>
                {resume ? 'Click to choose a different file' : 'PDF, DOC or DOCX · maximum 5 MB'}
              </span>
            </div>
            <span className="application-upload__browse">
              Browse files
              <Icon name="Plus" size={15} />
            </span>
            <input
              id="application-resume"
              type="file"
              accept=".pdf,.doc,.docx"
              {...register('resume')}
              aria-required="true"
              aria-invalid={!!errors.resume}
              aria-describedby={`application-resume-help${errors.resume ? ' application-resume-error' : ''}`}
            />
          </div>
          <p className="application-field__help" id="application-resume-help">
            {endpoint
              ? 'Your resume is sent with your application.'
              : 'For email applications, attach this resume in your email app before sending.'}
          </p>
          {errors.resume && (
            <span className="application-error" role="alert" id="application-resume-error">
              {errors.resume.message}
            </span>
          )}
        </div>
      </div>
      <div className="application-consent">
        <label>
          <input
            type="checkbox"
            {...register('consent')}
            aria-required="true"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'application-consent-error' : undefined}
          />
          <span>
            I agree to be contacted about my application and have read the{' '}
            <Link to="/privacy-policy">privacy policy</Link>.
          </span>
        </label>
        {errors.consent && (
          <span className="application-error" role="alert" id="application-consent-error">
            {errors.consent.message}
          </span>
        )}
      </div>
      <div className="application-form__submit">
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={isSubmitting ? 'Clock3' : 'ArrowUpRight'}
        >
          {isSubmitting
            ? 'Sending application…'
            : endpoint
              ? 'Submit application'
              : 'Prepare application'}
        </Button>
        <span>
          <Icon name="LockKeyhole" size={14} />
          For recruitment enquiries only.
        </span>
      </div>
      {result && (
        <div
          className={`application-result application-result--${result.type}`}
          role={result.type === 'error' ? 'alert' : 'status'}
        >
          <Icon name={result.type === 'success' ? 'CircleCheck' : 'Mail'} size={23} />
          <div>
            {result.draft ? (
              <>
                <h4>Your application draft is ready.</h4>
                <p>
                  Open the email draft, attach <strong>{result.draft.resumeName}</strong>, and send
                  it to our team. Nothing has been sent or uploaded yet.
                </p>
                <a className="text-link" href={result.draft.href}>
                  Open application email
                  <Icon name="ArrowUpRight" size={16} />
                </a>
                <details>
                  <summary>Review application details</summary>
                  <pre>{result.draft.body}</pre>
                </details>
              </>
            ) : (
              <p>{result.message}</p>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
