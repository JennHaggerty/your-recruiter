import DatabaseResponseInterface from '@/interfaces/DatabaseResponseInterface';
import { scrapeResponse } from '@/lib/firecrawl';
import { addToast } from '@heroui/react';
import { FormEvent, useLayoutEffect, useState } from 'react';
// General functions
export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};
export const getBadgeColor = (stage: string | undefined) => {
  let badgeColor:
    | 'success'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'warning'
    | 'danger'
    | undefined;
  switch (stage) {
    case 'interested':
      badgeColor = 'primary';
      break;
    case 'applied':
      badgeColor = 'success';
      break;
    case 'rejected':
      badgeColor = 'warning';
      break;
    case 'closed':
      badgeColor = 'danger';
      break;
    default:
      badgeColor = 'default';
  }
  return badgeColor;
};
export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
}
export const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  const body = JSON.stringify(data);
  await createApplication({ body }).catch(() =>
    addToast({
      color: 'danger',
      title: 'There was an error adding application.',
    })
  );
};
export const handleAiAdd = async (args: {
  e: FormEvent<HTMLFormElement>;
  apiKey: string;
  user_id: string;
}) => {
  const { e, apiKey, user_id } = args;
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const url = formData.get('posting_url') as string;
  await getListingData({ url, apiKey })
    .then(async (data) => {
      const scrapedData = data;
      scrapedData._user_id = user_id;
      const body = JSON.stringify(scrapedData);
      await createApplication({ body }).catch(() =>
        addToast({
          color: 'danger',
          title:
            'There was an error creating application with the listing data.',
        })
      );
    })
    .catch((e) => {
      addToast({
        color: 'danger',
        title: `There was an error with quickly adding the application, ${e}`,
      });
    });
};
export const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  const id = JSON.stringify(data.id);
  const body = JSON.stringify(data);
  await updateApplication({ id, body }).catch(() =>
    addToast({
      color: 'danger',
      title: 'There was an error updating application.',
    })
  );
};
// Users
const createUser = async (data: any) => {
  const response = await fetch('/api/users/createUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  });
  return response;
};
export const handleUserSignup = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  const dataString = JSON.stringify(data);
  createUser(dataString)
    .then((res) => {
      if (res.status === 400) {
        res.json().then((json) => {
          if (json.issues) {
            const issues = json.issues;
            issues.forEach((issue: { path: any; message: any }) => {
              addToast({
                color: 'danger',
                title: issue.path[0],
                description: issue.message,
              });
            });
          } else {
            addToast({
              color: 'danger',
              description: json.message,
            });
          }
          return;
        });
      }
      if (res.status === 201) {
        addToast({
          color: 'success',
          description: 'Successfully registered.',
        });
      }
    })
    .catch((error) => {
      addToast({ color: 'danger', description: 'There was an error.' });
    });
};
export const handleEmailChange = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  const body = JSON.stringify(data);
  await fetch('./api/users/editUser?id=' + data.user_id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then(async (res) => {
    if (res.status !== 201) {
      return addToast({
        color: 'danger',
        title: 'Could not change email.',
        description: JSON.stringify(await res.json()),
      });
    }
    if (res.status === 201) {
      return addToast({ color: 'success', title: 'Email updated.' });
    }
  });
  return;
};
export const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  const body = JSON.stringify(data);
  await fetch('./api/users/editUser?id=' + data.user_id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then(async (res) => {
    if (res.status !== 201) {
      if (res.status === 400) {
        res.json().then((json) => {
          if (json.issues) {
            const issues = json.issues;
            issues.forEach((issue: { path: any; message: any }) => {
              addToast({
                color: 'danger',
                title: issue.path[0],
                description: issue.message,
              });
            });
          } else {
            addToast({
              color: 'danger',
              description: json.message,
            });
          }
          return;
        });
      }
    }
    if (res.status === 201) {
      return addToast({ color: 'success', title: 'Password updated.' });
    }
  });
  return;
};
export const fetchUserLogin = async (args: {
  email: string;
  password: string;
}) => {
  const { email, password } = args;
  const body = JSON.stringify({
    email: email,
    password: password,
  });
  const user = await fetch('/api/users/userLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then((res) => {
      if (res.status !== 201) {
        res.json().then((json) => {
          if (json.issues) {
            const issues = json.issues;
            return issues.forEach((issue: { path: any; message: any }) => {
              addToast({
                color: 'danger',
                title: issue.path[0],
                description: issue.message,
              });
            });
          } else {
            return addToast({
              color: 'danger',
              description: json.message,
            });
          }
        });
      }
      return res.json();
    })
    .then((data) => {
      const token = data.token;
      window.localStorage.setItem('token', token);
      addToast({ color: 'success', title: 'Successfully logged in.' });
      return 'success';
    })
    .catch(() => {});
  return user;
};
export const fetchUserId = async (args: { token: string }) => {
  const { token } = args;
  const id = await fetch('/api/users/getUserId?token=' + token)
    .then((res) => {
      if (res.status !== 201) {
        return addToast({ color: 'danger', title: res.json() });
      } else {
        return res.json();
      }
    })
    .catch((e) => {
      return addToast({
        color: 'danger',
        title: `There was an error fetching session, ${e}`,
      });
    });
  return id;
};
export const fetchUser = async (args: { id: string }) => {
  const { id } = args;
  const user = await fetch('/api/users/getUser?id=' + id)
    .then((res) => {
      if (res.status !== 201) {
        addToast({ color: 'danger', title: res.json() });
        return;
      } else {
        return res.json();
      }
    })
    .catch((e) => {
      addToast({
        color: 'danger',
        title: `There was an error fetching user, ${e}`,
      });
      return;
    });
  return user;
};
// Applications
export const getListingData = async (args: { url: string; apiKey: string }) => {
  const { url, apiKey } = args;
  const data = await scrapeResponse({
    url: url,
    apiKey: apiKey,
  })
    .then((res) => res)
    .then((data) => {
      if (!data || data === undefined) {
        return addToast({
          color: 'danger',
          title:
            'Nothing was returned form the AI. Make sure it is a top-level domain, AI will not work on LinkedIn listings.',
        });
      }
      return data;
    })
    .catch((e) => {
      return addToast({
        color: 'danger',
        title: `There was an error getting listing data, ${e}`,
      });
    });
  return data;
};
export const fetchApplications = async (args: { user_id: string }) => {
  const { user_id } = args;
  const data = await fetch('/api/applications/getApplications?user=' + user_id)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      addToast({
        color: 'danger',
        title: `There was an error fetching applications, ${e}`,
      });
    });
  return data;
};
export const fetchApplication = async (args: { id: string }) => {
  const { id } = args;
  const application = await fetch('/api/applications/getApplication/?id=' + id)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      return addToast({
        color: 'danger',
        title: `There wsas an error fetching application, ${e}`,
      });
    });
  return application;
};
export const updateApplication = async (args: { id: string; body: string }) => {
  const { id, body } = args;
  await fetch('/api/applications/editApplication/?id=' + id, {
    method: 'POST',
    body: body,
  })
    .then((res) => res.json())
    .then((data: DatabaseResponseInterface) => {
      if (data.matchedCount && data.modifiedCount) {
        addToast({ color: 'success', description: 'Successfully updated.' });
      } else if (data.matchedCount && !data.modifiedCount) {
        addToast({
          color: 'warning',
          description: 'No changes made. Not updating.',
        });
      }
    })
    .catch((e) => {
      addToast({
        color: 'danger',
        description: `There was an error updating application, ${e}`,
      });
    });
  return;
};
export const createApplication = async (args: { body: string }) => {
  const { body } = args;
  await fetch('/api/applications/createApplication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then((res) => {
      if (res.status !== 201) {
        return addToast({
          color: 'danger',
          title: `There was an error creating application`,
        });
      } else {
        return addToast({ color: 'success', title: 'Successfully added.' });
      }
    })
    .catch((e) => {
      return addToast({
        color: 'danger',
        title: `There was an error creating application, ${e}`,
      });
    });
  return;
};
export const deleteApplication = async (args: { id: string }) => {
  const { id } = args;
  await fetch('/api/applications/deleteApplication/', {
    method: 'DELETE',
    body: id,
  })
    .then(() => {
      addToast({ color: 'success', title: 'Successfully deleted.' });
    })
    .catch((e) => {
      addToast({
        color: 'danger',
        title: `There was an error deleting application, ${e}`,
      });
    });
};
// Fircrawl & Open AI
export const handleOpenAi = async (args: {
  e: FormEvent<HTMLFormElement>;
  user_id: string;
}) => {
  const { e, user_id } = args;
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  const body = JSON.stringify(data);
  await fetch('./api/users/editUser?id=' + user_id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then((res) => {
    if (res.status !== 201) {
      return addToast({
        color: 'danger',
        title: 'Could not add OpenAi Key.',
        description: JSON.stringify(res.json),
      });
    }
    if (res.status === 201) {
      return addToast({ color: 'success', title: 'OpenAi Key added.' });
    }
  });
};
export const handleFirecrawl = async (args: {
  e: FormEvent<HTMLFormElement>;
  user_id: string;
}) => {
  const { e, user_id } = args;
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  const body = JSON.stringify(data);
  await fetch('./api/users/editUser?id=' + user_id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then((res) => {
    if (res.status !== 201) {
      return addToast({
        color: 'danger',
        title: 'Could not add Firecrawl Key.',
        description: JSON.stringify(res.json),
      });
    }
    if (res.status === 201) {
      return addToast({ color: 'success', title: 'Firecrawl Key added.' });
    }
  });
};
