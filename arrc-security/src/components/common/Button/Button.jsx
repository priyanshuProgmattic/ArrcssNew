import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';
import './Button.css';
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  icon = 'ArrowUpRight',
  className = '',
  ...props
}) {
  const classes = `button button--${variant} ${className}`;
  const content = (
    <>
      {children}
      {icon && <Icon name={icon} size={17} />}
    </>
  );
  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
