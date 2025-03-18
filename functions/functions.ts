import DatabaseResponse from "@/interfaces/DatabaseResponse";
import { scrapeResponse } from "@/lib/firecrawl";
import { addToast } from "@heroui/react";
import { FormEvent } from "react";
const createUser = async(data: any) => {
  const response = await fetch("/api/users/createUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
  return response;
}
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
                color: "danger",
                title: issue.path[0],
                description: issue.message,
              });
            });
          } else {
            addToast({
              color: "danger",
              description: json.message,
            });
          }
          return;
        });
      }
      if (res.status === 201) {
        addToast({
          color: "success",
          description: "Successfully registered.",
        });
      }
    })
    .catch((error) => {
      addToast({ color: "danger", description: "There was an error." });
    });
};
export const getBadgeColor = (stage: string | undefined) => {
  let badgeColor:
  | "success"
  | "default"
  | "primary"
  | "secondary"
  | "warning"
  | "danger"
  | undefined;
  switch (stage) {
    case "interested":
      badgeColor = "primary";
      break;
    case "applied":
      badgeColor = "success";
      break;
    case "rejected":
      badgeColor = "warning";
      break;
    case "closed":
      badgeColor = "default";
      break;
    default:
      badgeColor = "default";
  }
  return badgeColor;
}
export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}
export const getListingData = async (args: {url: string, apiKey: string;}) => {
  const {url, apiKey} = args;
  const data = await scrapeResponse({
    url: url,
    apiKey: apiKey!,
  })
  .then((res) => res)
  .then(async (data) => {
    if (!data || data === undefined) {
      addToast({
        color: "danger",
        title:
          "Nothing was returned form the AI. Make sure it is a top-level domain, AI will not work on LinkedIn listings.",
      });
      return;
    }
  })
  .catch((e) => {
    addToast({
      color: "danger",
      title: `There was an error getting listing data, ${e}`,
    });
  });
  return data;
}
export const fetchUserLogin = async (args: { email: string; password: string }) => {
  const { email, password } = args;
  const body = JSON.stringify({
    email: email,
    password: password,
  });
  const user = await fetch("/api/users/userLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((res) => {
      if (res.status === 400) {
        res.json().then((json) => {
          if (json.issues) {
            const issues = json.issues;
            issues.forEach((issue: { path: any; message: any }) => {
              addToast({
                color: "danger",
                title: issue.path[0],
                description: issue.message,
              });
            });
            return;
          } else {
            addToast({
              color: "danger",
              description: json.message,
            });
            return;
          }
        });
      } else if (res.status === 201) {
        addToast({
          color: "success",
          description: "Successfully logged in.",
        });
        return res.json();
      }
    })
    .then((data) => {
      return data.user;
    })
    .catch((e) => {
      addToast({
        color: "danger",
        title: `There was an error fetching user login, ${e}`
      })
    });
  return user;
};
export const fetchApplications = async () => {
  const data = await fetch("/api/applications/getApplications")
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      addToast({
        color: "danger",
        title: `There was an error fetching applications, ${e}`
      })
    });
  return data;
};
export const fetchApplication = async (args: { id: string }) => {
  const { id } = args;
  await fetch("/api/applications/getApplication/?id=" + id)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      addToast({
        color: "danger",
        title: `There wsas an error fetching application, ${e}`
      })
    });
};
export const updateApplication = async (args: { id: string; body: string }) => {
  const { id, body } = args;
  await fetch("/api/applications/editApplication/?id=" + id, {
    method: "POST",
    body: body,
  })
    .then((res) => res.json())
    .then((data: DatabaseResponse) => {
      if (data.matchedCount && data.modifiedCount) {
        addToast({ color: "success", description: "Successfully updated." });
      } else if (data.matchedCount && !data.modifiedCount) {
        addToast({
          color: "warning",
          description: "No changes made. Not updating.",
        });
      }
      fetchApplications();
    })
    .catch((e) => {
      addToast({ color: "danger", description: `There was an error updating application, ${e}` });
    });
};
export const createApplication = async (args: { body: string }) => {
  const { body } = args;
  await fetch("/api/applications/createApplication", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then(() => fetchApplications())
    .finally(() => {
      addToast({ color: "success", title: "Successfully added." });
      
    })
    .catch((e) => {
      addToast({
        color: "danger",
        title: `There was an error creating application, ${e}`,
      });
    });
};
export const deleteApplication = async (args: { id: string }) => {
  const { id } = args;
  await fetch("/api/applications/deleteApplication/", {
    method: "DELETE",
    body: id,
  })
    .then(() => {
      fetchApplications();
    })
    .catch((e) => {
      addToast({color: "danger", title: `There was an error deleting application, ${e}`})
    });
};