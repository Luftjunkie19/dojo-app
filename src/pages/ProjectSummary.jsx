import { useNavigate } from 'react-router-dom';

import Avatar from '../component/Avatar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';

function ProjectSummary({ projectData }) {
  const { deleteDocument } = useFirestore("projects");

  const navigate = useNavigate();

  const handleClick = () => {
    deleteDocument(projectData.id);
    navigate("/");
  };

  const { user } = useAuthContext();

  return (
    <>
      <div className="project-summary">
        <h2 className="page-title">{projectData.name}</h2>
        <p>By {projectData.createdBy.displayName}</p>
        <p className="due-date">
          Project due by {projectData.dueDate.toDate().toDateString()}
        </p>
        <p className="details">{projectData.details}</p>
        <h4>Project has been assigned to:</h4>
        <div className="assigned-users">
          {projectData.assignedUsersList.map((user) => (
            <div key={user.id}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
        {user.uid === projectData.createdBy.id && (
          <button className="btn" onClick={handleClick}>
            Mark as completed
          </button>
        )}
      </div>
    </>
  );
}

export default ProjectSummary;
