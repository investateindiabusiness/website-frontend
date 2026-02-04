import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Search, Filter } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  const cities = ['all', ...new Set(projects.map(p => p.city))];
  const stages = ['all', ...new Set(projects.map(p => p.stage))];

  let filteredProjects = [];
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.builderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || project.city === cityFilter;
    const matchesStage = stageFilter === 'all' || project.stage === stageFilter;
    if (matchesSearch && matchesCity && matchesStage) {
      filteredProjects.push(project);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Investment Opportunities</h1>
          <p className="text-xl text-blue-100">
            Explore verified real estate projects from India's leading developers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <Card className="mb-8 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by project, location, or builder..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* City Filter */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>

              {/* Stage Filter */}
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage === 'all' ? 'All Stages' : stage}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {loading
                  ? 'Loading projects...'
                  : `Showing ${filteredProjects.length} of ${projects.length} projects`}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setCityFilter('all');
                  setStageFilter('all');
                  setSortBy('featured');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-16">
              Loading projects...
            </div>
          ) : filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden cursor-pointer border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge className={`${
                    project.stage === 'Ready to Move' ? 'bg-green-500' :
                    project.stage === 'Under Construction' ? 'bg-orange-500' :
                    'bg-blue-500'
                  } text-white`}>
                    {project.stage}
                  </Badge>
                  {project.featured && (
                    <Badge className="bg-yellow-500 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black/70 text-white">
                    RERA: {project.reraNumber.slice(0, 15)}...
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.location}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Building2 className="h-4 w-4 mr-1" />
                  {project.builderName}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Price Range</div>
                    <div className="text-base font-bold text-blue-600">{project.priceRange}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Expected Yield</div>
                    <div className="text-base font-bold text-green-600">{project.expectedYield}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Configuration</div>
                    <div className="font-medium">{project.configurations}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Possession</div>
                    <div className="font-medium">{project.possession}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{project.views} views</span>
                    <span>{project.inquiries} inquiries</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    View Full Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Projects;
