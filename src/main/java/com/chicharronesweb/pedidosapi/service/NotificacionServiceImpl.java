package com.chicharronesweb.pedidosapi.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.chicharronesweb.pedidosapi.entity.Notificacion;
import com.chicharronesweb.pedidosapi.entity.Usuario;
import com.chicharronesweb.pedidosapi.repository.NotificacionRepository;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Override
    public List<Notificacion> findByUsuarioId(Integer usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    @Override
    public Optional<Notificacion> findById(Integer id) {
        return notificacionRepository.findById(id);
    }

    @Override
    public Notificacion save(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }

    @Override
    public void crearNotificacion(Usuario usuario, String tipo, String mensaje) {
     Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(usuario);
        notificacion.setTipo(tipo);
        notificacion.setMensaje(mensaje);
    notificacion.setLeida(false);
     notificacion.setFecha(java.time.LocalDateTime.now());
        notificacionRepository.save(notificacion);
}

    @Override
    public void marcarComoLeida(Integer id) {
        notificacionRepository.findById(id).ifPresent(notificacion -> {
            notificacion.setLeida(true);
            notificacionRepository.save(notificacion);
        });
    }
}
