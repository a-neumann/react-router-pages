import IRouteConfig from "../interfaces/IRouteConfig";

export const expectToHaveAsyncLoadingComponent = (route: IRouteConfig) => {
    
    expect(route.component.toString()).toContain("function");
};

export const expectToHaveNormalComponent = (route: IRouteConfig) => {
    
    expect(route.component.toString()).toContain("class");
};
