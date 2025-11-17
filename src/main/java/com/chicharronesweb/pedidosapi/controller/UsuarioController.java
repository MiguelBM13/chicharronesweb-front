package com.chicharronesweb.pedidosapi.controller;

import com.chicharronesweb.pedidosapi.entity.Usuario;
import com.chicharronesweb.pedidosapi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;


    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        // No mostrar las contraseñas
        usuarios.forEach(u -> u.setPassword(null));

        return ResponseEntity.ok(usuarios);
    }

    /**
     * Endpoint para registrar un nuevo usuario (cliente).
     * 
     * @param nuevoUsuario Datos del usuario a registrar (nombre, email, password).
     * @return El usuario creado o un error si el email ya existe.
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        // 1. Verificar si el email ya está en uso
        if (usuarioRepository.findByEmail(nuevoUsuario.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo electrónico ya está registrado.");
        }
        // 2. Establecer el rol por defecto como CLIENTE
        nuevoUsuario.setRol(Usuario.Rol.CLIENTE);
        // ADVERTENCIA: En un proyecto real, aquí se debería codificar la contraseña
        // antes de guardarla.
        // Ejemplo:
        // nuevoUsuario.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));
        // 3. Guardar el nuevo usuario en la base de datos
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        // 4. Devolver una respuesta exitosa (sin la contraseña)
        usuarioGuardado.setPassword(null); // No devolver la contraseña
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable int id) {
    Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        if (usuarioOptional.isPresent()) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok("Usuario eliminado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    /**
     * Endpoint para manejar el inicio de sesión de los usuarios.
     * 
     * @param loginRequest Un objeto Usuario que contiene el email y la contraseña.
     * @return Los datos del usuario (sin contraseña) si el login es exitoso, o un
     *         error en caso contrario.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginRequest) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOptional.isPresent()) {
            Usuario usuarioEncontrado = usuarioOptional.get();

            if (usuarioEncontrado.getPassword().equals(loginRequest.getPassword())) {

                Usuario respuestaUsuario = new Usuario();
                respuestaUsuario.setId(usuarioEncontrado.getId());
                respuestaUsuario.setNombre(usuarioEncontrado.getNombre());
                respuestaUsuario.setEmail(usuarioEncontrado.getEmail());
                respuestaUsuario.setRol(usuarioEncontrado.getRol());

                return ResponseEntity.ok(respuestaUsuario);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    // ✅ Nuevo: Actualizar perfil del usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable int id, @RequestBody Usuario usuarioActualizado) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);

        if (usuarioOptional.isPresent()) {
            Usuario usuarioExistente = usuarioOptional.get();

            // Verificar si el que realiza la solicitud es ADMIN
            boolean esAdmin = usuarioActualizado.getRol() == Usuario.Rol.ADMIN;

            // Actualizamos campos
            usuarioExistente.setNombre(usuarioActualizado.getNombre());
            usuarioExistente.setEmail(usuarioActualizado.getEmail());

            // Solo si el campo password tiene valor, se actualiza
            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
                usuarioExistente.setPassword(usuarioActualizado.getPassword());
            }

            // Solo si es admin puede modificar el rol
            if (usuarioActualizado.getRol() != null) {
                usuarioExistente.setRol(usuarioActualizado.getRol());
            }

            Usuario usuarioGuardado = usuarioRepository.save(usuarioExistente);
            usuarioGuardado.setPassword(null);
            return ResponseEntity.ok(usuarioGuardado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

}
