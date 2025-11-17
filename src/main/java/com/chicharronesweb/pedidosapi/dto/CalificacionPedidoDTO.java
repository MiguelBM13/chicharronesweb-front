package com.chicharronesweb.pedidosapi.dto;

import lombok.Data;

@Data
public class CalificacionPedidoDTO {
    private Integer pedidoId;
    private int puntuacion;
    private String comentario;
}