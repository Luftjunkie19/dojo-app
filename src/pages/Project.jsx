import './Project.css';

import { useParams } from 'react-router-dom';

import useDocument from '../hooks/useDocument';
import ProjectComments from './ProjectComments';
import ProjectSummary from './ProjectSummary';

function Project() {
  const { id } = useParams();

  console.log(id);

  const { document, error } = useDocument("projects", id);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!document) {
    return <div className="loading">Loading....</div>;
  }

  return (
    <div className="project-details">
      <ProjectSummary projectData={document} />
      <ProjectComments project={document} />
    </div>
  );
}

export default Project;
