package com.chicharronesweb.pedidosapi.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.chicharronesweb.pedidosapi.entity.Notificacion;
import com.chicharronesweb.pedidosapi.service.NotificacionService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping("/{idUsuario}")
    public ResponseEntity<List<Notificacion>> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        List<Notificacion> notificaciones = notificacionService.findByUsuarioId(idUsuario);
        return ResponseEntity.ok(notificaciones);
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<String> marcarComoLeida(@PathVariable Integer id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.ok("Notificación marcada como leída");
    }

    @PostMapping
    public ResponseEntity<Notificacion> crearNotificacion(@RequestBody Notificacion notificacion) {
        Notificacion nueva = notificacionService.save(notificacion);
        return ResponseEntity.ok(nueva);
    }
}
