"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProjectRedirect() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      router.replace(`/properties/${id}`);
    }
  }, [id, router]);

  return null;
}
