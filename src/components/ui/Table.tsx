import { clsx } from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx(
          'w-full text-sm text-left',
          'text-gray-700 dark:text-gray-300',
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <thead
      className={clsx(
        'text-xs uppercase bg-gray-100 dark:bg-gray-700',
        'text-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody className={clsx('divide-y divide-gray-200 dark:divide-gray-700', className)} {...props}>
      {children}
    </tbody>
  );
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  highlight?: boolean;
}

export function TableRow({ children, highlight, className, ...props }: TableRowProps) {
  return (
    <tr
      className={clsx(
        'transition-colors',
        highlight
          ? 'bg-green-50 dark:bg-green-900/20'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  header?: boolean;
}

export function TableCell({ children, header, className, ...props }: TableCellProps) {
  const Component = header ? 'th' : 'td';
  return (
    <Component
      className={clsx(
        'px-4 py-3',
        header && 'font-medium',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
