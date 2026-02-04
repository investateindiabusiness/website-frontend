import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Building2 } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [builder, setBuilder] = useState(null);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading project...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <Card className="border-none shadow-lg">
          <div className="relative h-96">
            <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
            <Badge className="absolute top-4 right-4 bg-blue-500 text-white">{project.stage}</Badge>
          </div>
          <CardContent className="p-8">
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <div className="flex items-center text-gray-600 mb-6">
              <Building2 className="h-5 w-5 mr-2" />
              <span className="text-lg">By {project.builderName}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div>
                <div className="text-sm text-gray-500 mb-1">Price Range</div>
                <div className="text-xl font-bold text-blue-600">{project.priceRange}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Expected Yield</div>
                <div className="text-xl font-bold text-green-600">{project.expectedYield}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Configurations</div>
                <div className="text-base font-semibold">{project.configurations}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Possession</div>
                <div className="text-base font-semibold">{project.possession}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">About the Project</h3>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            {builder && (
              <div className="border-t pt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Developer</h3>
                <div className="flex items-start space-x-6">
                  <img src={builder.logo} alt={builder.companyName} className="w-24 h-24 object-cover rounded-lg" />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{builder.companyName}</h4>
                    <p className="text-gray-700">{builder.overview}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Button onClick={() => navigate('/register')} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-6 text-lg">
              Register to Send Inquiry
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
