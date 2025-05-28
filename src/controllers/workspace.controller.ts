import { Request, Response } from "express";
import { Workspace } from "../model/workspace.model.js";
import { Interview } from "../model/interview.model.js";
export const createWorkspace = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        const userId = req.id;
    
        if (!title) {
        return res.status(400).json({ message: "Title is required" });
        }
    
        const workspace = await Workspace.create({
        title,
        createdBy: userId,
        });
    
        return res.status(201).json({ message: "Workspace created", workspace });
    } catch (error) {
        return res.status(500).json({ error: "Failed to create workspace" });
    }
    }
    export const renameWorkspace = async (req: Request, res: Response) => {
    try {
        const workspaceId = req.params.id;
        const { title } = req.body;
        const userId = req.id;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const workspace = await Workspace.findOneAndUpdate(
            { _id: workspaceId, createdBy: userId },
            { title },
            { new: true }
        );

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        return res.status(200).json({ message: "Workspace renamed", workspace });
    } catch (error) {
        return res.status(500).json({ error: "Failed to rename workspace" });
    }
}
export const deleteWorkspace = async (req: Request, res: Response) => {
    try {
        const workspaceId = req.params.id;
        const userId = req.id;

        const workspace = await Workspace.findOneAndDelete({
            _id: workspaceId,
            createdBy: userId
        });
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        return res.status(200).json({ message: "Workspace deleted" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete workspace" });
    }
}
export const getWorkspaces = async (req: Request, res: Response) => {
    try {
        const userId = req.id;

        const workspaces = await Workspace.find({ createdBy: userId })
            .populate("Interviews")
            .exec();
        if (!workspaces || workspaces.length === 0) {
            return res.status(404).json({ message: "No workspaces found" });
        }
        return res.status(200).json({ workspaces });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch workspaces" });
    }
}
export const getWorkspaceById = async (req: Request, res: Response) => {
    try {
        const workspaceId = req.params.id;
        const userId = req.id;

        const workspace = await Workspace.findOne({ _id: workspaceId, createdBy: userId })
            .populate("Interviews")
            .exec();

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        return res.status(200).json({ workspace });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch workspace" });
    }
}
export const addInterview = async (req: Request, res: Response) => {
    try {
        const workspaceId = req.params.id;
        const { interviewId } = req.body;
        const userId = req.id;

        if (!interviewId) {
            return res.status(400).json({ message: "Interview ID is required" });
        }

        const workspace = await Workspace.findOneAndUpdate(
            { _id: workspaceId, createdBy: userId },
            { $addToSet: { Interviews: interviewId } },
            { new: true }
        );

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        return res.status(200).json({ message: "Interview added to workspace", workspace });
    } catch (error) {
        return res.status(500).json({ error: "Failed to add interview to workspace" });
    }
}
export const getInterviewByID = async (req: Request, res: Response) => {
    try {
        const interviewId = req.params.id;
        const userId = req.id;

        const interview = await Interview.findOne({ _id: interviewId, practicedBy: userId })
            .exec();
        
        const workspace = await Workspace.findOne({ Interviews: interviewId, createdBy: userId })
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }
        if(!workspace) {
            return res.status(404).json({ message: "Workspace not found for this interview" });
        }

        return res.status(200).json({interview});
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch interview" });
    }
}