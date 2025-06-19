import * as React from "react";

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
export function Table({ className, ...props }: TableProps) {
  return (
    <table className={cn("w-full text-sm caption-bottom", className)} {...props} />
  );
}

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={className} {...props} />;
}

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {}
export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-gray-50",
        className
      )}
      {...props}
    />
  );
}

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}
export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-gray-500",
        className
      )}
      {...props}
    />
  );
}

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}
export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn("p-2 align-middle", className)} {...props} />;
}
