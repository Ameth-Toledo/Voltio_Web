export interface BentoItem {
  title: string;
  description: string;
  colSpan: 'md:col-span-1' | 'md:col-span-2';
  descriptionColor: string;
  banner?: string;
}
