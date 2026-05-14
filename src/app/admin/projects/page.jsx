"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Clock, FileWarning, Plus, Trash2, Eye, ShieldCheck, CheckCircle, XCircle, MapPin, RefreshCw, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects, verifyProjectStatus, requestProjectChanges, verifyProjectEdits, revokeProjectRejection, approveProject } from '@/api';

export default function AdminProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewProjectData, setViewProjectData] = useState(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllProjects(user?.token);
      setProjects(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) loadProjects();
  }, [user, loadProjects]);

  const filteredProjects = projects.filter(project => {
    if (filter === 'pending') return project.status === 'pending' || project.hasPendingEdits;
    if (filter === 'approved') return project.status === 'approved' && !project.hasPendingEdits;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div><h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1><p className="text-gray-600">Approve or reject project listings.</p></div>
          <div className="flex bg-gray-200/50 p-1 rounded-lg">
            {['all', 'pending', 'approved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === f ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>{f.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full py-24 text-center">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">No projects found.</div>
          ) : filteredProjects.map((project) => (
            <Card key={project.id} className="border border-gray-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><Building2 /></div>
                    <div><h3 className="text-xl font-bold">{project.projectName || 'Unnamed'}</h3><p className="text-sm text-gray-500">{project.projectLocation}</p></div>
                  </div>
                  <Badge>{project.status}</Badge>
                </div>
                <Button onClick={() => setViewProjectData(project)} className="w-full bg-gray-900 text-white">View Full Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
