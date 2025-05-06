exports.createProject = async (req, res) => {
    const { id, name, description, status, progress, leadId, teamMembers, dueDate, icon } = req.body;
  
    try {
      const project = new Project({
        id, name, description, status, progress, leadId, teamMembers, dueDate, icon
      });
      await project.save();
      res.status(201).json(project);
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
  
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
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