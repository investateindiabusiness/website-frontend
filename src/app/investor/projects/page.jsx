"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Search, Filter, Loader2 } from 'lucide-react';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';
import { parseProjectImages } from '@/utils/imageCompressor';

export default function InvestorProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/projects?role=investor', {
          method: 'GET'
        });
        setProjects(data || []);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load projects.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const cities = ['all', ...new Set(projects.map(p => p.city).filter(Boolean))];
  const stages = ['all', ...new Set(projects.map(p => p.stage).filter(Boolean))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.projectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.projectLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.builderName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || project.city === cityFilter;
    const matchesStage = stageFilter === 'all' || project.stage === stageFilter;
    return matchesSearch && matchesCity && matchesStage;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Investment Opportunities</h1>
          <p className="text-xl text-blue-100">Explore verified real estate projects from India's leading developers</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex-grow">
        <Card className="mb-8 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by project, location, or builder..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none">
                {cities.map(city => <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>)}
              </select>
              <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none">
                {stages.map(stage => <option key={stage} value={stage}>{stage === 'all' ? 'All Stages' : stage}</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-16 flex flex-col items-center">
              <Loader2 className="animate-spin mb-2" />
              Loading projects...
            </div>
          ) : filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden cursor-pointer border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              onClick={() => router.push(`/project/${project.id}`)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={parseProjectImages(project.projectImages)[0]}
                  alt={project.projectName}
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge className="bg-blue-500 text-white">{project.status}</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.projectLocation}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.projectName}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Building2 className="h-4 w-4 mr-1" />
                  {project.builderName}
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Full Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
