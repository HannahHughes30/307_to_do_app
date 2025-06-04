import React from "react";
import { render } from "@testing-library/react";
import MyApp from "../MyApp";


global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );

  
// Mock hooks and components used inside MyApp
jest.mock("../useSettings", () => ({
  useSettings: () => ({
    settings: {
      darkMode: false,
      colorTheme: "pink",
      butterThreshold: 60,
      showButterInCalendar: true,
      dailyQuotes: false,
    },
    updateSetting: jest.fn(),
    requestNotificationPermission: jest.fn(),
    clearCompletedTasks: jest.fn(),
    resetCategoriesToDefault: jest.fn(),
  }),
}));

jest.mock("../useProfile", () => ({
  useProfile: () => ({
    userProfile: {
      title: "Bread Master",
      name: "Gianni",
    },
    editingProfile: { title: false, name: false },
    setEditingProfile: jest.fn(),
    updateProfile: jest.fn(),
    handleProfileKeyDown: jest.fn(),
  }),
}));

jest.mock("../CategoryPage", () => () => <div>Mocked Category Page</div>);
jest.mock("../CalendarView", () => () => <div>Mocked Calendar View</div>);
jest.mock("../CuteBread", () => () => <div>Mocked CuteBread</div>);
jest.mock("../achievements", () => ({
  getAchievements: () => [],
  breadQuotes: ["Test quote 1", "Test quote 2"],
}));

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: "/" }),
  };
});

describe("MyApp", () => {
  it("renders without crashing", () => {
    render(<MyApp />);
  });
});
