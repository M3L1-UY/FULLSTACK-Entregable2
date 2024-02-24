import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

import AddStudentView from "../views/StudentViews/AddStudentView.vue";
import ProfileStudentView from "../views/StudentViews/ProfileStudentView.vue";
import ListStudentView from "../views/StudentViews/ListStudentView.vue";

import ContactView from "../views/ContactViews/ContactView.vue";
import ListContactView from "../views/ContactViews/ListContactView.vue";

import AddTeacherView from "@/views/TeacherViews/AddTeacherView.vue";
import ProfileTeacherView from "@/views/TeacherViews/ProfileTeacherView.vue";
import ListTeacherView from "@/views/TeacherViews/ListTeacherView.vue";

import AddCourseView from "@/views/CourseViews/AddCourseView.vue";
import AddStudentToCourseView from "@/views/CourseViews/AddStudentToCourseView.vue";
import AddTeacherToCourseView from "@/views/CourseViews/AddTeacherToCourseView.vue"; 
import ListCourseStudentsView from "@/views/CourseViews/ListCourseStudentsView.vue";
import ListCourseView from "@/views/CourseViews/ListCourseView.vue";
import ListCourseAdminView from "@/views/CourseViews/ListCourseAdminView.vue";
import ListCourseTeachersView from "@/views/CourseViews/ListCourseTeachersView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [ 
    {
      path: "/",
      name: "Inicio",
      component: HomeView,
    },
    {
      //*****************ESTUDIANTES****************
      path: "/registerstudent/",
      name: "RegisterStudent",
      component: AddStudentView,
    },
    {
      path: "/profilestudentedit/:id/:ed",
      name: "ProfileStudentEdit",
      component: ProfileStudentView,
    },
    {
      path: "/profilestudentupdate/:id/:ed",
      name: "ProfileStudentUpdate",
      component: ProfileStudentView,
    },
    {
      path: "/liststudents",
      name: "ListStudents",
      component: ListStudentView,
    },
    {
      //*****************CONTACTOS****************
      path: "/contact",
      name: "Contact",
      component: ContactView,
    },
    {
      path: "/listContact",
      name: "ListContact",
      component: ListContactView,
    },
    {
      //*****************PROFESORES****************

      path: "/registerteacher",
      name: "RegisterTeacher",
      component: AddTeacherView ,
    },
    { 
      path: "/profileteacheredit/:id/:ed",
      name: "ProfileTeacherEdit",
      component: ProfileTeacherView,
    },
    {
      path: "/profilestudentupdate/:id/:ed",
      name: "ProfileTeacherUpdate",
      component: ProfileTeacherView,
    },
    {
      path: "/listteachers", 
      name: "ListTeachers",
      component: ListTeacherView,
    },
    {
      //*****************CURSOS****************

      path: "/registercourse",
      name: "RegisterCourse",
      component: AddCourseView ,
    },
    {
      path: "/listCourses",
      name: "ListCourses",
      component: ListCourseView,
    },
    {
      path: "/listCourses/:type",
      name: "ListCourse",
      component: ListCourseAdminView,
    },
    {
      path: "/enrollStudent/:cod/:name/:ci/",
      name: "AddStudentToCourse",
      component: AddStudentToCourseView,
    },
    {
      path: "/asignarprofesor/:cod/:name",
      name: "AddTeacherToCourse",
      component: AddTeacherToCourseView,
    },
    {
      path: "/listStudentsByCourse",
      name: "ListStudentsByCourse",
      component: ListCourseStudentsView,
    },
    {
      path: "/listTeachersByCourse",
      name: "ListTeachersByCourse",
      component: ListCourseTeachersView,
    },
  ],
});

export default router;
