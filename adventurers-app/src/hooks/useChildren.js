import { useEffect, useState } from "react"
import { fromSnakeCaseToTitleCase } from "@/utils/stringUtils"
import { fromDateOfBirthToAge } from "@/utils/dateUtils";

function useChildren(clubYearLabel,{by, direction}) {
  const [rawChildren, setRawChildren] = useState([]);
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);

  function transformChildenData(rawChildren) {
    return rawChildren.map((child) => ({
      id: child.id,
      name: `${child.firstName} ${child.lastName}`,
      age: fromDateOfBirthToAge(child.dateOfBirth),
      class: fromSnakeCaseToTitleCase(child.class)
    }));
  }

  function sortChildren(childrenList) {
    if (by) {
      let order = 0;
      const orderDirection = direction === 'asc' ? 1 : -1;
      const sortedChildren = [...childrenList].sort((a, b) => {
        switch(by) {
          case 'name':
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            order = nameA.localeCompare(nameB);
            break;
          case 'age':
            order = a.age - b.age;
            break;
          case 'class':
            const classA = a.class.toLowerCase();
            const classB = b.class.toLowerCase();
            order = classA.localeCompare(classB);
            break;
          default:
            order = 0;
        }
        return order * orderDirection;
      });
      return sortedChildren
    }

    return childrenList;
  }


  // Fetch children data from the API
  useEffect(() => {
    setLoadingChildren(true);
    fetch(`/api/club-years/${clubYearLabel}/children`)
      .then(res => res.json())
      .then(data => {
        setRawChildren(data);
        setLoadingChildren(false);
      })
  }, [clubYearLabel])

  // Transform and sort children whenever rawChildren, sortBy, or sortDirection change
  useEffect(() => {
    let childrenList = transformChildenData(rawChildren);
    childrenList = sortChildren(childrenList);
    setChildren(childrenList);
  }, [by, direction, rawChildren]);

  return { children, loadingChildren };
}

export default useChildren;