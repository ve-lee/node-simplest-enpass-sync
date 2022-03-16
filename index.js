import 'dotenv/config';
import { v2 as webdav } from 'webdav-server';

// User manager (tells who are the users)
const userManager = new webdav.SimpleUserManager();
const user = userManager.addUser(process.env.NODE_WEBDAV_USERNAME, process.env.NODE_WEBDAV_PASSWORD, false);

// Privilege manager (tells which users can access which files/folders)
const privilegeManager = new webdav.SimplePathPrivilegeManager();
privilegeManager.setRights(user, '/', [ 'all' ]);

const server = new webdav.WebDAVServer({
    // HTTP Digest authentication with the realm 'Default realm'
    httpAuthentication: new webdav.HTTPDigestAuthentication(userManager, 'Default realm'),
    // https: {
    //   key:,
    //   cert:
    // },
    privilegeManager: privilegeManager,
    port: 1900, // Load the server on the port 2000 (if not specified, default is 1900)
});

server.setFileSystem('/', new webdav.PhysicalFileSystem('./share'), (success) => {
    server.start(() => console.log('READY'));
})
