import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfiguratorShell } from '@/components/configurator/ConfiguratorShell';
import { FURNITURE_CATALOG, getFurniture } from '@/lib/furniture/catalog';

interface ConfiguratorPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ id: string }> {
  return FURNITURE_CATALOG.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: ConfiguratorPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getFurniture(id);
  return { title: item ? `配置${item.name}` : '未找到家具' };
}

export default async function ConfiguratorPage({ params }: ConfiguratorPageProps) {
  const { id } = await params;
  const item = getFurniture(id);
  if (!item) {
    notFound();
  }
  return <ConfiguratorShell item={item} />;
}
