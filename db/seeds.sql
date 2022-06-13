INSERT INTO department (name)
    VALUES  ("UX Team"),
            ("Backend Team"),
            ("DevOps Team"),
            ("QA Team");



INSERT INTO role (title, salary, department_id)
    VALUES  ("Web Development Services",80000, 1),
            ("Cloud Architect",120000,3),
            ("System administrator",140000,3),
            ("Mobile Development Services",100000,1),
            ("Backend Development Services",140000,2),
            ("Middle stack Devs",100000,2),
            ("Software Testing Services",120000,4),
            ("QA Analyst",130000,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES  ("Brandon","Flowers",1,null),
            ("Dave","Keuning",2,1),
            ("Dell", "Neal",3,1),
            ("Matt","Norcross",4,null),
            ("Ronnie","Vannucci",5,null),
            ("Brian","Heavens",4,5);
       
