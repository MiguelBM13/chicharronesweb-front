package com.chicharronesweb.pedidosapi.service;

import java.util.List;
import java.util.Optional;
import com.chicharronesweb.pedidosapi.entity.Notificacion;
import com.chicharronesweb.pedidosapi.entity.Usuario;

public interface NotificacionService {
    List<Notificacion> findByUsuarioId(Integer usuarioId);
    Optional<Notificacion> findById(Integer id);
    Notificacion save(Notificacion notificacion);
    void marcarComoLeida(Integer id);

    // ✅ Nuevo método
    void crearNotificacion(Usuario usuario, String tipo, String mensaje);
}
