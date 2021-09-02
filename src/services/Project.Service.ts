import { getRepository } from "typeorm";
import { Project } from "../models/Project.Model";
import { ProjectStage } from "../models/ProjectStage.Enum";

export async function getProjects(){
  return await getRepository(Project).find({
    relations: ['author', 'fileDocuments']
  });
}

export async function getProjectById(id: string){
  return await getRepository(Project).findOne({
    relations: ['author', 'commentaries', 'fileDocuments', 'commentaries.author'],
    where: {id}
  });
}

export async function createProject(project: Project){
  return getRepository(Project).create(project);
}

export async function saveProject(project: Project){
  return await getRepository(Project).save(project);
}

export async function updateProject(project: Project, updatedProject: Project){
  return getRepository(Project).merge(project, updatedProject);
}

export async function deleteProjectById(id: string){
  return await getRepository(Project).delete({id});
}

export async function changeProjectById(id: string, updatedProject: Project){
  updatedProject.id = id;
  return await getRepository(Project).save(updatedProject);
}

export async function getProjectsInfo(){
  return {
    AllProjects: await getRepository(Project).count(),
    InProgress: await getRepository(Project).count({ projectStage: ProjectStage.InProgress }),
    Finished: await getRepository(Project).count({ projectStage: ProjectStage.Finished })
  }
}

export async function getProjectsChart(courseNames: string[]){
  let chartData: any[] = [];
  for (let k = 0; k < courseNames.length; k++){
    chartData.push({
      AllProjects: await getRepository(Project).count({ courseName: courseNames[k] }),
      InProgress: await getRepository(Project).count({ courseName: courseNames[k], projectStage: ProjectStage.InProgress }),
      Finished: await getRepository(Project).count({ courseName: courseNames[k], projectStage: ProjectStage.Finished })
    });
  }
  return chartData;
}