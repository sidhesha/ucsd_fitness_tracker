export function mockFetch() {
  global.fetch = jest.fn().mockImplementation((url: string) =>
    Promise.resolve({
      json: () => {
        let response;
        const path = transformUrl(url);
        if (localStorage.getItem("login") == "1") {
          response = responses_login[path];
        } else {
          response = responses_guest[path];
        }
        return Promise.resolve(response);
      },
    })
  );
}

function transformUrl(url: string) {
  return url.replace(/^.*\/\/[^\/]+:?[0-9]?\//i, "/");
}

const responses_login: Record<string, object> = {
  "/api/user": {
    user: {
      image: "",
    }
  },
};

const responses_guest: Record<string, object> = {
  "/api/user": {
    error: "User not logged in",
  },
};
