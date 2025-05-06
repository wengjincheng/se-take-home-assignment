# System Design

This file hold the thingking history and design decisions of the system.

## Thingking history

1. Based on the requirements, I should not complete this project as a whole offical web application which has a Frontend end(such as Next.js) and a Backend end(such as Express.js).
2. I think I can complete this prototype using Frontend tec stack(UI application), which will be great to display.
3. Which framework or library is the best choice for this prototype?, See the bot and order status can be changed very frequently, maybe the SPA type is the best, and React.js is the great library I can trust to use.
4. which bundle or build tool is the best for this prototype? Webpack is very common, Vite has great performance and more simple than webpack, maybe I can use Vite to build this React Prototype project.
5. Based on user story, there are three roles, normal customer , VIP customer and manager, maybe I should have a role select, or maybe it is a overall controller display and the user is manager.Because I should make this project small and clean enough, the role select maybe can be the next stage development requirement.
6. In the end, I think I should add some CSS to make this UI application have a great appearance.

## Design

It is a Frontend UI SPA application, tec stack:

- The web framework/library -> React
- The bundle/build tool -> Vite
- Program Language -> TypeScript
- CSS Library -> Taiwind CSS

## Future improvements

- Should add strong backend server to insist data using Express.js, Redis and Mysql (Maybe)
- Should use docker to deploy this react application, make the CI/CD ops simple.
- Maybe the UI is not good enough, should invite Senior UI/UE to improve this project.
- Order system should have mobile end, which can let users do orders on their Iphone.
- Maybe should add AI-Bot to enhance the Customer User Experience.
- Maybe should use AWS/Azure cloud tools to enhance all performance, such as CDN to improve the static access speed
- And more...

