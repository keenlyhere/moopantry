'use client'
import Dashboard from "./dashboard/page";

// export default function Home() {

//   const { data: session, status } = useSession();
//   console.log('session:', session, status);

//   if (status === 'loading') {
//     return (
//       <Box
//         sx={{
//           width: '100vw',
//           height: '100vh',
//           bgcolor: 'primary.main',
//         }}
//         display='flex'
//         justifyContent='center'
//         alignItems='center'
//       >
//         <span className="loader"></span>
//       </Box>
//     )
//   }

//   return (
//       session ? (
//         <Box
//           sx={{
//             width: '100vw',
//             height: '100vh',
//             bgcolor: 'secondary.main',
//           }}
//           display={'flex'}
//           flexDirection={{ xs: 'column-reverse', sm: 'column-reverse', md: 'row'}}
//         >
//           <Sidebar />
//           <Box
//             sx={{
//               p: '1.5rem 3rem',
//               overflow: 'scroll',
//               flexGrow: 1,
//             }}
//           >
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           </Box>
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             p: '1.5rem 3rem',
//             overflow: 'scroll',
//             width: '100vw',
//             height: '100vh',
//           }}
//         >
//           <Login />
//         </Box>
//       )
//   )
// }

export default function Home() {
  return <Dashboard />
}
