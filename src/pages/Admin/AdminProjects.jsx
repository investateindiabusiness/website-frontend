import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    builderName: '',
    location: '',
    city: '',
    stage: 'Under Construction',
    priceRange: '',
    expectedYield: '',
    configurations: '',
    area: '',
    possession: '',
    reraNumber: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      builderName: '',
      location: '',
      city: '',
      stage: 'Under Construction',
      priceRange: '',
      expectedYield: '',
      configurations: '',
      area: '',
      possession: '',
      reraNumber: '',
      description: ''
    });
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      builderName: project.builderName,
      location: project.location,
      city: project.city,
      stage: project.stage,
      priceRange: project.priceRange,
      expectedYield: project.expectedYield,
      configurations: project.configurations,
      area: project.area,
      possession: project.possession,
      reraNumber: project.reraNumber,
      description: project.description
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to save project. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster />

      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1>
            <p className="text-gray-600">Add, edit, and manage project listings</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 mr-2" />
                Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogDescription>
                  Fill in the project details below. All fields are required.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="builderName">Builder Name *</Label>
                    <Input
                      id="builderName"
                      value={formData.builderName}
                      onChange={(e) => setFormData({ ...formData, builderName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Project Stage *</Label>
                    <select
                      id="stage"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      required
                    >
                      <option value="New Launch">New Launch</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready to Move">Ready to Move</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reraNumber">RERA Number *</Label>
                    <Input
                      id="reraNumber"
                      value={formData.reraNumber}
                      onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range *</Label>
                    <Input
                      id="priceRange"
                      placeholder="₹1.2 Cr - ₹2.8 Cr"
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedYield">Expected Yield *</Label>
                    <Input
                      id="expectedYield"
                      placeholder="8-10%"
                      value={formData.expectedYield}
                      onChange={(e) => setFormData({ ...formData, expectedYield: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="configurations">Configurations *</Label>
                    <Input
                      id="configurations"
                      placeholder="2 BHK, 3 BHK, 4 BHK"
                      value={formData.configurations}
                      onChange={(e) => setFormData({ ...formData, configurations: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area Range *</Label>
                    <Input
                      id="area"
                      placeholder="1200 - 2800 sq.ft"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="possession">Possession *</Label>
                  <Input
                    id="possession"
                    placeholder="Dec 2026"
                    value={formData.possession}
                    onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-none shadow-lg bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Project</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Builder</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stage</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price Range</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stats</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        Loading projects...
                      </td>
                    </tr>
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No projects found.
                      </td>
                    </tr>
                  ) : projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">{project.configurations}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{project.builderName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{project.city}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${
                          project.stage === 'Ready to Move' ? 'bg-green-500' :
                          project.stage === 'Under Construction' ? 'bg-orange-500' :
                          'bg-blue-500'
                        } text-white`}>
                          {project.stage}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{project.priceRange}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-700">{project.views} views</div>
                          <div className="text-gray-500">{project.inquiries} inquiries</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProjects;
