"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FormattedDateProps {
  dateString: string;
  formatString?: string;
}

export function FormattedDate({ dateString, formatString = "PPP p" }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Check if running on the client-side
    if (typeof window !== 'undefined' && dateString) {
      try {
        const date = new Date(dateString);
        // Check if the date is valid
        if (!isNaN(date.getTime())) {
          setFormattedDate(format(date, formatString, { locale: es }));
        } else {
          setFormattedDate('Fecha inválida');
        }
      } catch (error) {
        setFormattedDate('Fecha inválida');
      }
    }
  }, [dateString, formatString]);

  // To prevent hydration mismatch, we can return a placeholder or null on initial server render
  if (!formattedDate) {
    return null; 
  }

  return <>{formattedDate}</>;
}
