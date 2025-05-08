const Project = require('../models/projectModel');



exports.createProject = async (req, res) => {
    const { name, description, status, progress, leadId, teamMembers, dueDate, icon } = req.body;
    const id = `project_${new Date().toISOString() }` // Generate a unique ID for the project
    try {
      let existingProject = await Project.findOne({ id });

      if (existingProject){
        return res.status(400).json({ message: 'Project already exists' });
      };

      const project = new Project({
        id, name, description, status, progress, leadId, teamMembers, dueDate, icon
      });
      await project.save();
      res.status(201).json("Project created ",project);
    } catch (error) {
      res.status(400).json({ message: 'Error creating project', error });
    }
  };
  
  // Get all projects (Admin only)
  exports.getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).json(projects);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching projects', error });
    }
  };
  
  // Get project by ID (Admin or authorized user)
  exports.getProjectById = async (req, res) => {

    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching project', error });
    }
  };
  
  // Update project (Admin only)
  exports.updateProject = async (req, res) => {
    const { name, description, status, progress, leadId, teamMembers, dueDate, icon } = req.body;
    const projectId = req.params.id; // Extract project ID from request parameters
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { name, description, status, progress, leadId, teamMembers, dueDate, icon },
        { new: true } // Returns the updated project
      );
  
      if (!updatedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(400).json({ message: 'Error updating project', error });
    }
  };
  
  // Delete project (Admin only)
  exports.deleteProject = async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting project', error });
    }
  };