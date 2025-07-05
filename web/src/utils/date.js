import { format, formatDistance, parseISO } from 'date-fns';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../config/constants';

export const formatDate = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, DATE_FORMAT);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, DATE_TIME_FORMAT);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(parsedDate, new Date(), { addSuffix: true });
};

export const isValidDate = (date) => {
  if (!date) return false;
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return parsedDate instanceof Date && !isNaN(parsedDate);
}; 