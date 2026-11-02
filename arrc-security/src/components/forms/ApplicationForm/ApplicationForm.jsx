import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function ApplicationForm({ category, onCancel, onSubmittingChange }) {
  const endpoint = import.meta.env.VITE_CAREERS_ENDPOINT?.trim() || '/api/careers';
  const schema = useMemo(() => createApplicationSchema(category.id), [category.id]);
  const {
    register,
    handleSubmit,
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
  const resultRef = useRef(null);
  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [result]);
  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  async function submit(values) {
    setResult(null);
    try {
      await sendApplication(endpoint, values, category.id);
      setResult({
        type: 'success',
        message: 'Your application has been received. Thank you for your interest in ARRC.',
      });
      reset();
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message,
        draft: buildApplicationDraft(values, category.id),
      });
    }
  }

  function field(name, label, { type = 'text', autoComplete, required = false } = {}) {
    return (
      <div className="application-field">
        <label htmlFor={`application-${name}`}>
          {label}
          {required ? ' (required)' : ' (optional)'}
        </label>
        <input
          id={`application-${name}`}
          type={type}
          placeholder={label}
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
    <form
      className="application-form"
      aria-label={`${category.title} application`}
      onSubmit={handleSubmit(submit)}
      noValidate
    >
      <div className="application-form__grid">
        <div className="application-field">
          <label htmlFor="application-designation">Job role (required)</label>
          <select
            id="application-designation"
            {...register('designation')}
            aria-required="true"
            aria-invalid={!!errors.designation}
            aria-describedby={errors.designation ? 'application-designation-error' : undefined}
          >
            <option value="">Select job role</option>
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
        {field('fullName', 'Your name', { required: true, autoComplete: 'name' })}
        {field('email', 'Email', { required: true, type: 'email', autoComplete: 'email' })}
        {field('phone', 'Phone number', { required: true, type: 'tel', autoComplete: 'tel' })}
        {field('address', 'Address', { autoComplete: 'street-address' })}
        {field('currentLocation', 'Current location', { autoComplete: 'address-level2' })}
        {field('experience', 'Experience')}
        {field('lastSalary', 'Last salary')}
        {field('lastPost', 'Last post in')}
        <div className="application-field application-field--upload">
          <label htmlFor="application-resume">Upload resume (required)</label>
          <div className={`application-upload ${errors.resume ? 'has-error' : ''}`}>
            <Icon name={resume ? 'FileCheck2' : 'Upload'} size={18} />
            <span>{resume ? resume.name : 'Upload resume'}</span>
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
          {errors.resume && (
            <span className="application-error" role="alert" id="application-resume-error">
              {errors.resume.message}
            </span>
          )}
        </div>
      </div>
      <p id="application-resume-help" className="application-form__help">
        Resume: PDF, DOC or DOCX, up to 5 MB. Your resume is included when you submit.
      </p>
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
            <Link to="/privacy-policy" onClick={onCancel}>
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <span className="application-error" role="alert" id="application-consent-error">
            {errors.consent.message}
          </span>
        )}
      </div>
      <div className="application-form__actions">
        <Button type="submit" disabled={isSubmitting} icon={null}>
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          icon={null}
        >
          Cancel
        </Button>
      </div>
      {result && (
        <div
          ref={resultRef}
          className={`application-result application-result--${result.type}`}
          role={result.type === 'error' ? 'alert' : 'status'}
        >
          <Icon name={result.type === 'success' ? 'CircleCheck' : 'Mail'} size={21} />
          <div>
            <p>{result.message}</p>
            {result.draft && (
              <>
                <p>
                  You can also open an email draft, attach{' '}
                  <strong>{result.draft.resumeName}</strong>, and send it to our team.
                </p>
                <a className="text-link" href={result.draft.href}>
                  Open application email
                  <Icon name="ArrowUpRight" size={16} />
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
