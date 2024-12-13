describe('Verificar mi aplicación', () => {

  const numero = Math.floor(Math.random() * 1000000) + 1;

  it('Verificar inicio de sesión con credenciales incorrectas', () => {
    cy.visit('/login').then(() => {
      cy.contains('Sistema asistencia DUOC');
      cy.get('#userName').invoke('val', '');
      cy.get('#userName').type('cuenta-inexistente');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/login').as('route').then(() => {
        cy.contains('Ingresar');
        cy.wait(5000); 
      });
    });
  })

  it('Verificar inicio de sesión con credenciales correctas', () => {
    cy.visit('/').then(() => {
      cy.contains('Sistema asistencia DUOC');
      cy.get('#userName').invoke('val', '');
      cy.get('#userName').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/login').as('route').then(() => {
        cy.contains('¡Bienvenid@!');
        cy.get('#wellcome_title').contains('¡Bienvenid@!');
        cy.get('#wellcome_user').contains('Ana Torres');
        cy.wait(3000); 
        cy.get('app-welcome').within(() => {
          cy.contains('Cerrar sesión').should('be.visible').click();
        });
      
        // Verificar que se redirige a la página de inicio de sesión
        cy.url().should('include', '/login');
        cy.contains('Sistema asistencia DUOC');
        cy.wait(5000); 
      });
    });
  })


  it('Verificar publicación en foro', () => {
    cy.visit('/').then(() => {
      cy.contains('Sistema asistencia DUOC');
      cy.get('#userName').invoke('val', '');
      cy.get('#userName').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/login').as('route').then(() => {
        cy.contains('¡Bienvenid@!');
        cy.get('#wellcome_title').contains('¡Bienvenid@!');
        cy.get('#wellcome_user').contains('Ana Torres');
        cy.get('app-footer').within(() => {
          cy.get('ion-segment-button[value="forum"]').click(); // Selecciona el botón "forum"
        });
        cy.wait(2000); 
        cy.get('#titulos')
        .scrollIntoView() // Asegúrate de que el input esté visible
        .click() // Asegúrate de que tenga foco
        .type(`Título de prueba ${numero}`);

        cy.wait(500); 
        cy.get('#contenidos')
        .scrollIntoView()
        .click()
        .type(`Contenido de prueba ${numero}`);// Escribe en el campo


        cy.contains('Guardar').click();
        cy.wait(3000);
        cy.contains(`Título de prueba ${numero}`).should('exist');
        cy.get('app-footer').within(() => {
          cy.get('ion-segment-button[value="welcome"]').click(); // Selecciona el botón "home"
        });
  
        // Cerrar sesión
        cy.contains('Cerrar sesión').click();
        cy.wait(4000); 
      });
    });
  })

  it('Verificar si se borran las publicaciones del foro', () => {
    cy.visit('/').then(() => {
      cy.contains('Sistema asistencia DUOC');
      cy.get('#userName').invoke('val', '');
      cy.get('#userName').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/login').as('route').then(() => {
        cy.contains('¡Bienvenid@!');
        cy.get('#wellcome_title').contains('¡Bienvenid@!');
        cy.get('#wellcome_user').contains('Ana Torres');
        cy.get('app-footer').within(() => {
          cy.get('ion-segment-button[value="forum"]').click(); // Selecciona el botón "forum"
        });
      // Esperar a que cargue el foro y buscar el post por su título
      cy.wait(2000);
      cy.contains(`Título de prueba ${numero}`).should('exist').then(() => {
        // Desplaza solo hasta el botón "Borrar"
        cy.contains('Borrar')
          .scrollIntoView() // Hace scroll hasta el botón "Borrar"
          .click(); // Haz clic en el botón "Borrar"
      });

      // Confirmar que el post ha sido eliminado
      cy.wait(2000); // Espera para garantizar la actualización
      cy.contains(`Título de prueba ${numero}`).should('not.exist');

      // Regresar al home antes de cerrar sesión
      cy.get('app-footer').within(() => {
        cy.get('ion-segment-button[value="welcome"]').click(); // Selecciona el botón "home"
      });

      // Cerrar sesión
      cy.contains('Cerrar sesión').click();
      cy.wait(3000); 
      });
    });
  })


  it('Validar los campos del componente mis datos', () => {
    cy.visit('/').then(() => {
      cy.contains('Sistema asistencia DUOC');
      cy.get('#userName').invoke('val', '');
      cy.get('#userName').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();
      cy.intercept('/login').as('route').then(() => {
        cy.contains('¡Bienvenid@!');
        cy.get('#wellcome_title').contains('¡Bienvenid@!');
        cy.get('#wellcome_user').contains('Ana Torres');
  // Navegar a la página Mis Datos
  cy.get('app-footer').within(() => {
    cy.get('ion-segment-button[value="mis-datos"]').click(); // Asegúrate de que el botón Mis Datos se selecciona
  });

  cy.get('#userNamed')
  .scrollIntoView()
  .invoke('val', '') // Limpiar el campo
  .trigger('input');

// Intentar guardar y esperar la validación
cy.contains('Guardar')
  .scrollIntoView()
  .click();

// Verificar que aparezca un sysalert y aceptarlo
cy.contains('El nombre de usuario no puede estar vacío')
  .should('be.visible');
       cy.wait(3000);
cy.contains('Aceptar').click();

// Completar con un nombre válido y guardar
cy.get('#userNamed').invoke('val', 'atorres').trigger('input');
cy.contains('Guardar').scrollIntoView().click();

// Validar el correo electrónico
cy.get('#email')
  .scrollIntoView()
  .invoke('val', 'correo_invalido') // Escribe un correo no válido
  .trigger('input');
cy.contains('Guardar').scrollIntoView().click();

// Verificar el sysalert del correo
cy.contains('Por favor, ingresa un correo electrónico válido')
  .should('be.visible');
  cy.wait(3000);  
cy.contains('Aceptar').click();

// Completar con un correo válido
cy.get('#email').invoke('val', 'atorres@duocuc.cl').trigger('input');
cy.contains('Guardar').scrollIntoView().click();

// Escribir una fecha inválida (formato inexistente)
// Escribir una fecha no válida
// cy.get('#calendario')
//   .scrollIntoView()
//   .invoke('val', 'invalid-date')  // Escribir una fecha inválida
//   .trigger('ionChange');           // Asegurarse de que el evento ionChange sea disparado

// cy.contains('Guardar').scrollIntoView().click();
// cy.wait(3000);

// // Verificar que el sysalert muestra el error
// cy.contains('Por favor, ingresa una fecha válida de nacimiento')
//   .should('be.visible');
// cy.wait(3000);

// // Hacer clic en el botón 'Aceptar' para cerrar el sysalert
// cy.contains('Aceptar').click();

// // Completar con una fecha válida
// cy.get('#calendario').invoke('val', '2000-01-05').trigger('ionChange');  // Fecha válida en formato correcto
// cy.contains('Guardar').scrollIntoView().click();
// Validar la dirección
cy.get('#address')
  .scrollIntoView()
  .invoke('val', '') // Limpiar el campo de dirección
  .trigger('input');
cy.contains('Guardar').scrollIntoView().click();

// Verificar el sysalert de dirección
cy.contains('La dirección no puede estar vacía')
  .should('be.visible');
  cy.wait(3000);  
cy.contains('Aceptar').click();

// Completar con una dirección válida
cy.get('#address').invoke('val', 'La Florida').trigger('input');
cy.contains('Guardar').scrollIntoView().click();

// Validar el nombre
cy.get('#firstName')
  .scrollIntoView()
  .invoke('val', '') // Limpiar el campo de nombre
  .trigger('input');
cy.contains('Guardar').scrollIntoView().click();

// Verificar el sysalert de nombre
cy.contains('El usuario debe tener un nombre')
  .should('be.visible');
  cy.wait(3000); 
cy.contains('Aceptar').click();

// Completar con un nombre válido
cy.get('#firstName').invoke('val', 'Ana').trigger('input');
cy.contains('Guardar').scrollIntoView().click();

// Validar el apellido
cy.get('#lastName')
  .scrollIntoView()
  .invoke('val', '') // Limpiar el campo de apellido
  .trigger('input');
cy.contains('Guardar').scrollIntoView().click();

// Verificar el sysalert de apellido
cy.contains('El apellido no puede estar vacío')
  .should('be.visible');
  cy.wait(3000); 
cy.contains('Aceptar').click();

// Completar con un apellido válido
cy.get('#lastName').invoke('val', 'Torres').trigger('input');
cy.contains('Guardar').scrollIntoView().click();


      // Regresar al home antes de cerrar sesión
      cy.get('app-footer').within(() => {
        cy.get('ion-segment-button[value="welcome"]').click(); // Selecciona el botón "home"
      });

      // Cerrar sesión
      cy.contains('Cerrar sesión').click();
      cy.wait(3000); // Esperar 
      });
    });
  })


it('Actualizar el nombre en Mis Datos y verificar persistencia', () => {
  cy.visit('/').then(() => {
    // Verificar pantalla de inicio
    cy.contains('Sistema asistencia DUOC');
    
    // Iniciar sesión
    cy.get('#userName').invoke('val', '');
    cy.get('#userName').type('atorres');
    cy.get('#password').invoke('val', '');
    cy.get('#password').type('1234');
    cy.contains('Ingresar').click();

    // Interceptar y verificar inicio de sesión exitoso
    cy.intercept('/login').as('route').then(() => {
      cy.contains('¡Bienvenid@!');
      cy.get('#wellcome_title').contains('¡Bienvenid@!');
      cy.get('#wellcome_user').contains('Ana Torres');

      // Navegar a la página de Mis Datos
      cy.get('app-footer').within(() => {
        cy.get('ion-segment-button[value="mis-datos"]').click(); // Selecciona el botón "mis-datos"
      });

      // Esperar a que cargue la página Mis Datos
      cy.wait(2000);
      
      // Cambiar el nombre en Mis Datos
      cy.get('#firstName')
        .scrollIntoView()
        .invoke('val', '') // Limpia el campo
        .type('Ana María'); // Escribe el nuevo nombre
        cy.wait(3000); 
      // Guardar cambios
      cy.contains('Guardar').scrollIntoView().click();

      // Verificar que el cambio fue exitoso
      cy.wait(2000); // Espera para garantizar la actualización

      // Regresar al home
      cy.get('app-footer').within(() => {
        cy.get('ion-segment-button[value="welcome"]').click(); // Selecciona el botón "home"
      });

      // Verificar que el nombre actualizado aparece en el mensaje de bienvenida
      cy.get('#wellcome_user').contains('Ana María').should('exist');
      cy.wait(2000);
      // Cerrar sesión
      cy.contains('Cerrar sesión').click();

      // Volver a iniciar sesión para verificar persistencia
      cy.get('#userName').invoke('val', '');
      cy.get('#userName').type('atorres');
      cy.get('#password').invoke('val', '');
      cy.get('#password').type('1234');
      cy.contains('Ingresar').click();

      // Verificar que el cambio persiste tras cerrar sesión
      cy.contains('¡Bienvenid@!');
      cy.get('#wellcome_user').contains('Ana María').should('exist');
      cy.wait(2000);
      // Navegar nuevamente a la página de Mis Datos para restablecer el nombre
      cy.get('app-footer').within(() => {
        cy.get('ion-segment-button[value="mis-datos"]').click(); // Selecciona el botón "mis-datos"
      });

      // Restablecer el nombre original
      cy.wait(2000);
      cy.get('#firstName')
        .scrollIntoView()
        .invoke('val', '') // Limpia el campo
        .type('Ana'); // Restaura el nombre original
      
      // Guardar cambios
      cy.contains('Guardar').scrollIntoView().click();

      // Regresar al home para verificar
      cy.get('app-footer').within(() => {
        cy.get('ion-segment-button[value="welcome"]').click(); // Selecciona el botón "home"
      });

      // Verificar que el nombre original aparece en el mensaje de bienvenida
      cy.get('#wellcome_user').contains('Ana').should('exist');
      cy.wait(2000);
      // Cerrar sesión para finalizar
      cy.contains('Cerrar sesión').click();
    });
  });
});
});


// // Validar que el nombre de usuario no esté vacío
// cy.get('#userNamed')
//   .scrollIntoView()
//   .invoke('val', '') // Limpiar el campo
//   .trigger('input');

// // Guardar y verificar la validación
// cy.contains('Guardar')
//   .scrollIntoView()
//   .click();
// cy.get('ion-toast') // Seleccionar el toast
//   .shadow()
//   .find('.toast-message')
//   .should('contain.text', 'El nombre de usuario no puede estar vacío');

// // Completar con un nombre válido
// cy.get('#userNamed').invoke('val', 'atorres').trigger('input');
// cy.contains('Guardar').scrollIntoView().click();

// // Validar el correo electrónico
// cy.get('#email')
//   .scrollIntoView()
//   .invoke('val', 'correo_invalido') // Escribe un correo no válido
//   .trigger('input');
// cy.contains('Guardar').scrollIntoView().click();
// cy.get('ion-toast') // Seleccionar el toast
//   .shadow()
//   .find('.toast-message')
//   .should('contain.text', 'Por favor, ingresa un correo electrónico válido.');

// // Completar con un correo válido
// cy.get('#email').invoke('val', 'atorres@duocuc.cl').trigger('input');
// cy.contains('Guardar').scrollIntoView().click();

// // Validar la fecha de nacimiento
// cy.get('#calendario')
//   .scrollIntoView()
//   .invoke('val', 'invalid-date') // Escribe una fecha inválida
//   .trigger('input');
// cy.contains('Guardar').scrollIntoView().click();
// cy.get('ion-toast') // Seleccionar el toast
//   .shadow()
//   .find('.toast-message')
//   .should('contain.text', 'Por favor, ingresa una fecha válida de nacimiento.');

// // Completar con una fecha válida
// cy.get('#calendario').invoke('val', '2000-01-05').trigger('input');
// cy.contains('Guardar').scrollIntoView().click();

// // Validar la dirección
// cy.get('#address')
//   .scrollIntoView()
//   .invoke('val', '') // Limpiar el campo de dirección
//   .trigger('input');
// cy.contains('Guardar').scrollIntoView().click();
// cy.get('ion-toast') // Seleccionar el toast
//   .shadow()
//   .find('.toast-message')
//   .should('contain.text', 'La dirección no puede estar vacía');

// // Completar con una dirección válida
// cy.get('#address').invoke('val', 'La Florida').trigger('input');
// cy.contains('Guardar').scrollIntoView().click();

// // Validar el nombre completo
// cy.get('#firstName')
//   .scrollIntoView()
//   .invoke('val', '') // Limpiar el campo de nombre completo
//   .trigger('input');
// cy.contains('Guardar').scrollIntoView().click();
// cy.get('ion-toast') // Seleccionar el toast
//   .shadow()
//   .find('.toast-message')
//   .should('contain.text', 'El usuario debe tener un nombre');

// // Completar con un nombre válido
// cy.get('#firstName').invoke('val', 'Ana').trigger('input');
// cy.contains('Guardar').scrollIntoView().click();

// // Validar el apellido
// cy.get('#lastName')
//   .scrollIntoView()
//   .invoke('val', '') // Limpiar el campo de apellido
//   .trigger('input');
// cy.contains('Guardar').scrollIntoView().click();
// cy.get('ion-toast') // Seleccionar el toast
//   .shadow()
//   .find('.toast-message')
//   .should('contain.text', 'El apellido no puede estar vacío');

// // Completar con un apellido válido
// cy.get('#lastName').invoke('val', 'Torres').trigger('input');
// cy.contains('Guardar').scrollIntoView().click();