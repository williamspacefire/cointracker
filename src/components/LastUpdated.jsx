import React from 'react'
import { format } from 'date-fns'
import { useLanguage } from '../context/LanguageContext'

export default function LastUpdated({ timestamp }) {
  const { dictionary } = useLanguage()
  
  console.log('Dictionary:', dictionary); // Debug log

  if (!timestamp) {
    return null;
  }

  try {
    // Create date directly from ISO string
    const date = new Date(timestamp);

    // Validate the date
    if (isNaN(date.getTime())) {
      console.error('Invalid timestamp:', timestamp);
      return null;
    }

    // Use optional chaining to prevent errors
    const translatedText = dictionary?.common?.lastUpdated || 'Last updated';

    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {translatedText}: {format(date, 'HH:mm:ss')}
      </div>
    );
  } catch (error) {
    console.error('Error in LastUpdated component:', error);
    return null;
  }
}
