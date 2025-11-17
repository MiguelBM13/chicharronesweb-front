package com.chicharronesweb.pedidosapi.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.chicharronesweb.pedidosapi.entity.Notificacion;

public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByUsuarioIdOrderByFechaDesc(Integer usuarioId);
}
