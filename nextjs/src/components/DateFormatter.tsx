import { format, isToday } from 'date-fns'
import { de } from 'date-fns/locale'
import React from 'react'

interface DateFormatterProps {
  isoTimestamp: string
}

/**
 * A component that formats a timestamp to a readable format.
 */
export function DateFormatter({
  isoTimestamp,
}: DateFormatterProps): React.ReactElement {
  return <>{formatTimestampDE(isoTimestamp)}</>
}

/**
 * Format the timestamp to a readable format.
 */
const formatTimestampDE = (isoTimestamp: string) => {
  const date = new Date(isoTimestamp)

  if (isToday(date)) {
    // Return the formatted string as 'Today at 5:53 PM'
    return `Heute, ${format(date, 'p', { locale: de })} Uhr`
  } else {
    // Return the date in some other format, for example 'MMM dd, yyyy, h:mm a'
    return `am ${format(date, 'dd. MMMM, p', { locale: de })} Uhr`
  }
}

/**
 * Format the timestamp to a readable format.
 */
const formatTimestamp = (isoTimestamp: string) => {
  const date = new Date(isoTimestamp)

  if (isToday(date)) {
    // Return the formatted string as 'Today at 5:53 PM'
    return `at Today, ${format(date, 'p')}`
  } else {
    // Return the date in some other format, for example 'MMM dd, yyyy, h:mm a'
    return format(date, 'MMM dd, p')
  }
}
